function runPostInstall() {
    try {
        console.log('🔨 Executing post-installation script...');

    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    }
};

runPostInstall();