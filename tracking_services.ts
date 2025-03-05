const trackingServices = [
  {
    name: "frontend production",
    repository: "NTUCSIECouncil/council.csie-frontend",
    branch: "main",
    path: "../council.csie-frontend",
    nameOnPm2: "frontend",
    buildCommand: "npm ci && npm run build",
  },
  {
    name: "backend production",
    repository: "NTUCSIECouncil/council.csie-backend",
    branch: "main",
    path: "../council.csie-backend",
    nameOnPm2: "backend",
    buildCommand: "npm ci",
  }
];
export default trackingServices;
