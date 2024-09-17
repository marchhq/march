import Logo from "@/src/lib/icons/Logo"

const About = (): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-gray-color">
      <div className="flex flex-col items-center text-center">
        <Logo size={64} />
        <h1 className="mt-8 font-semibold">march for web</h1>
        <div className="mt-4 text-[17px] font-medium">
          <p>version: 1.0.1</p>
          <p>@ March Labs Inc, All rights reserved.</p>
        </div>
      </div>
      <div className="mt-12 space-y-4 text-sm font-semibold">
        <p>follow us on twitter</p>
        <p>view our code</p>
        <p>join our discord</p>
        <p>public wiki</p>
      </div>
    </div>
  )
}

export default About
