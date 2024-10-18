const installGitHub = (): void => {
  const appInstallationUrl = 
    process.env.NEXT_PUBLIC_GITHUB_APP_INSTALLATION_URL || 
    "https://github.com/apps/march-app";
  window.location.href = appInstallationUrl;

};

export default installGitHub;