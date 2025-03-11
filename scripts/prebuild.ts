function runPreBuild() {
    try {
        console.log('🔨 Executing pre-build script...');

    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
};

runPreBuild();