import { synthesizeWorkspaceData } from './agents/reasoningEngine.js';

async function runTestSuite() {
  console.log('Running Context-Collapse Test Suite...\n');
  
  try {
    console.log('Test 1: Validating Reasoning Engine JSON Output Structure...');
    const result = await synthesizeWorkspaceData();
    
    // Validate output structure
    if (typeof result !== 'object' || result === null) {
      throw new Error('Output is not a valid JSON object');
    }
    
    if (typeof result.primary_task !== 'string') {
      throw new Error('primary_task is missing or not a string');
    }
    
    if (typeof result.file_id !== 'string' && result.file_id !== null) {
      throw new Error('file_id is invalid');
    }
    
    if (typeof result.focus_duration !== 'number') {
      throw new Error('focus_duration is missing or not a number');
    }
    
    if (!Array.isArray(result.suppressed_distractions)) {
      throw new Error('suppressed_distractions is missing or not an array');
    }
    
    console.log('✓ Test 1 Passed: Output strictly conforms to the expected JSON schema.');
    console.log('\nAI Output Preview:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('✗ Test Suite Failed:', error.message);
    process.exit(1);
  }
}

runTestSuite();
