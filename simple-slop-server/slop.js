// JavaScript implementation of the SLOP pattern
import express from 'express';
import axios from 'axios';

// Available tools and resources
const tools = {
  calculator: {
    id: 'calculator',
    description: 'Basic math. Takes an expression as input in format {"expression": "<expression>"}',
    execute: params => ({ result: eval(params.expression) })
  },
  greet: {
    id: 'greet',
    description: 'Says hello. Takes a name as input in format {"name": "<name>"}',
    execute: params => ({ result: `Hello, ${params.name}!` })
  }
};

const resources = {
  hello: { id: 'hello', content: 'Hello, SLOP!' }
};

// Setup server
const app = express();
app.use(express.json());

// In-memory storage
const memory = new Map();

// CHAT
app.post('/chat', (req, res) => {
  const message = req.body.messages?.[0]?.content || 'nothing';
  res.json({
    message: {
      role: 'assistant',
      content: `You said: ${message}`
    }
  });
});

// TOOLS
app.get('/tools', (_, res) => res.json({ tools: Object.values(tools) }));
app.post('/tools/:id', (req, res) => {
  const tool = tools[req.params.id];
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  res.json(tool.execute(req.body));
});

// MEMORY
app.post('/memory', (req, res) => {
  const { key, value } = req.body;
  memory.set(key, value);
  res.json({ status: 'stored' });
});

app.get('/memory/:key', (req, res) => {
  res.json({ value: memory.get(req.params.key) });
});

// RESOURCES
app.get('/resources', (_, res) => res.json({ resources: Object.values(resources) }));
app.get('/resources/:id', (req, res) => {
  const resource = resources[req.params.id];
  if (!resource) return res.status(404).json({ error: 'Resource not found' });
  res.json(resource);
});

// PAY
app.post('/pay', (_, res) => {
  res.json({
    transaction_id: 'tx_' + Date.now(),
    status: 'success'
  });
});

// Start server and run tests
app.listen(4000, async () => {
  console.log('✨ SLOP running on http://localhost:4000\n');
  
  const api = axios.create({ baseURL: 'http://localhost:4000' });
  
  try {
    // Test chat
    console.log('📝 Testing chat...');
    const chat = await api.post('/chat', {
      messages: [{ content: 'Hello SLOP!' }]
    });
    console.log(chat.data.message.content, '\n');

    // Test tools
    console.log('🔧 Testing tools...');
    const calc = await api.post('/tools/calculator', {
      expression: '2 + 2'
    });
    console.log('2 + 2 =', calc.data.result);

    const greet = await api.post('/tools/greet', {
      name: 'SLOP'
    });
    console.log(greet.data.result, '\n');

    // Test memory
    console.log('💾 Testing memory...');
    await api.post('/memory', {
      key: 'test',
      value: 'hello world'
    });
    const memory = await api.get('/memory/test');
    console.log('Stored value:', memory.data.value, '\n');

    // Test resources
    console.log('📚 Testing resources...');
    const hello = await api.get('/resources/hello');
    console.log('Resource content:', hello.data.content, '\n');

    // Test pay
    console.log('💰 Testing pay...');
    const pay = await api.post('/pay', {
      amount: 10
    });
    console.log('Transaction:', pay.data.transaction_id, '\n');

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
});