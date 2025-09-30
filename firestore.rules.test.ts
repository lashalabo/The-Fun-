/// <reference types="jest" />
/// <reference types="node" />
import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, serverTimestamp, setLogLevel } from 'firebase/firestore';
import * as fs from 'fs';

let testEnv: RulesTestEnvironment;

// Helper function to get an authenticated Firestore instance
function getAuthFirestore(auth: { uid: string }) {
    return testEnv.authenticatedContext(auth.uid).firestore();
}

// Helper function to get an unauthenticated Firestore instance
function getUnauthFirestore() {
    return testEnv.unauthenticatedContext().firestore();
}

beforeAll(async () => {
    // Silence expected permission-denied errors
    setLogLevel('error');

    testEnv = await initializeTestEnvironment({
        projectId: 'the-fun-app-test', // Use a dummy project ID
        firestore: {
            rules: fs.readFileSync('firestore.rules', 'utf8'),
            host: 'localhost',
            port: 8080,
        },
    });
});

afterAll(async () => {
    await testEnv.cleanup();
});

beforeEach(async () => {
    await testEnv.clearFirestore();
});

describe('Friendship Security Rules', () => {
    const alice = { uid: 'alice' };
    const bob = { uid: 'bob' };
    const charlie = { uid: 'charlie' };

    const friendshipId = [alice.uid, bob.uid].sort().join('_');
    const friendshipData = {
        userIds: [alice.uid, bob.uid],
        requesterId: alice.uid,
        requesteeId: bob.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
    };

    it('should NOT allow an unauthenticated user to read friendships', async () => {
        const db = getUnauthFirestore();
        const friendshipDoc = doc(db, 'friendships', friendshipId);
        await assertFails(getDoc(friendshipDoc));
    });

    it('should allow a user to read a friendship they are part of', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
            await setDoc(doc(context.firestore(), 'friendships', friendshipId), friendshipData);
        });

        const db = getAuthFirestore(alice);
        const friendshipDoc = doc(db, 'friendships', friendshipId);
        await assertSucceeds(getDoc(friendshipDoc));
    });

    it('should NOT allow a user to read a friendship they are NOT part of', async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
            await setDoc(doc(context.firestore(), 'friendships', friendshipId), friendshipData);
        });

        const db = getAuthFirestore(charlie); // Charlie is not in the friendship
        const friendshipDoc = doc(db, 'friendships', friendshipId);
        await assertFails(getDoc(friendshipDoc));
    });

    it('should allow a user to create a friend request for themself', async () => {
        const db = getAuthFirestore(alice);
        const newFriendshipDoc = doc(db, 'friendships', friendshipId);
        await assertSucceeds(setDoc(newFriendshipDoc, friendshipData));
    });

    it('should NOT allow a user to create a friend request for someone else', async () => {
        const db = getAuthFirestore(charlie); // Charlie tries to make a request for Alice
        const newFriendshipDoc = doc(db, 'friendships', friendshipId);
        await assertFails(setDoc(newFriendshipDoc, friendshipData));
    });
});