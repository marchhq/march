declare module "*.svg" {
  import React = require("react")
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}

declare module "*.json" {
  const content: string
  export default content
}

declare module "*.wav"
