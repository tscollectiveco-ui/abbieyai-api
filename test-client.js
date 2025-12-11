/**
 * Simple tests for the AbbieyAIClient
 * Run with: node test-client.js
 */

// Import the client
import AbbieyAIClient from './index.js';

// Test configuration
const TEST_API_URL = 'https://abbieyai-api.workers.dev';

async function runTests() {
    console.log('🧪 Testing AbbieyAIClient...\n');
    
    // Test 1: Client initialization
    console.log('Test 1: Client Initialization');
    try {
        const client = new AbbieyAIClient({ apiUrl: TEST_API_URL });
        console.log('✅ Client initialized successfully');
        console.log(`   API URL: ${client.apiUrl}\n`);
    } catch (error) {
        console.log('❌ Failed to initialize client:', error.message);
        return;
    }
    
    // Test 2: History management
    console.log('Test 2: History Management');
    try {
        const client = new AbbieyAIClient({ apiUrl: TEST_API_URL });
        
        // Test getHistory on empty client
        const emptyHistory = client.getHistory();
        if (emptyHistory.length === 0) {
            console.log('✅ Empty history works');
        } else {
            console.log('❌ Expected empty history');
        }
        
        // Test setHistory
        const testHistory = [
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi there!' }
        ];
        client.setHistory(testHistory);
        const retrievedHistory = client.getHistory();
        if (retrievedHistory.length === 2 && retrievedHistory[0].content === 'Hello') {
            console.log('✅ setHistory works');
        } else {
            console.log('❌ setHistory failed');
        }
        
        // Test clearHistory
        client.clearHistory();
        const clearedHistory = client.getHistory();
        if (clearedHistory.length === 0) {
            console.log('✅ clearHistory works\n');
        } else {
            console.log('❌ clearHistory failed\n');
        }
    } catch (error) {
        console.log('❌ History management failed:', error.message, '\n');
    }
    
    // Test 3: Error handling for invalid input
    console.log('Test 3: Input Validation');
    try {
        const client = new AbbieyAIClient({ apiUrl: TEST_API_URL });
        
        // Try to send empty message
        try {
            await client.chat('');
            console.log('❌ Should have thrown error for empty message');
        } catch (error) {
            console.log('✅ Correctly rejects empty message');
        }
        
        // Try to send non-string message
        try {
            await client.chat(123);
            console.log('❌ Should have thrown error for non-string message');
        } catch (error) {
            console.log('✅ Correctly rejects non-string message');
        }
        
        // Try to set invalid history
        try {
            client.setHistory('not an array');
            console.log('❌ Should have thrown error for invalid history');
        } catch (error) {
            console.log('✅ Correctly rejects invalid history\n');
        }
    } catch (error) {
        console.log('❌ Input validation failed:', error.message, '\n');
    }
    
    console.log('✨ Basic tests completed!\n');
    console.log('Note: Network tests require a live API endpoint and are not included');
    console.log('      in these basic tests. Use the example.html file to test live API calls.');
}

// Run tests
runTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
});
