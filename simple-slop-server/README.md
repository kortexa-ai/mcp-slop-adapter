# SLOP JavaScript Example

A simple implementation of the [SLOP](https://github.com/agnt-gg/slop) pattern in JavaScript.

## JavaScript Quick Start

```bash
# Clone the repo
git clone https://github.com/agnt-gg/slop
cd slop/javascript

# Install dependencies
npm install

# Run it
npm start
```

## Endpoints

```javascript
// CHAT - Talk to AI
POST /chat
{
  "messages": [{ "content": "Hello SLOP!" }]
}

// TOOLS - Use tools
GET /tools
POST /tools/calculator { "expression": "2 + 2" }
POST /tools/greet { "name": "SLOP" }

// MEMORY - Store data
POST /memory { "key": "test", "value": "hello" }
GET /memory/test

// RESOURCES - Get knowledge
GET /resources
GET /resources/hello

// PAY - Handle payments
POST /pay { "amount": 10 }
```

## Structure

- `slop.js` - The entire implementation
- `package.json` - Dependencies and scripts

That's it. Just two files.

## Dependencies

- `express` - For clean routing
- `axios` - For clean HTTP requests

## Try It

After starting the server, it automatically runs tests for all endpoints. Watch the magic happen!

```bash
npm start

# Output:
✨ SLOP running on http://localhost:3000

📝 Testing chat...
You said: Hello SLOP!

🔧 Testing tools...
2 + 2 = 4
Hello, SLOP!

💾 Testing memory...
Stored value: hello world

📚 Testing resources...
Resource content: Hello, SLOP!

💰 Testing pay...
Transaction: tx_1234567890

✅ All tests passed!
```

## Learn More

Check out the [main SLOP repository](https://github.com/agnt-gg/slop) for:
- Full specification
- Other language examples
- Core concepts
- Best practices

Remember: SLOP is just a pattern. This is a simple implementation example to show how it works.