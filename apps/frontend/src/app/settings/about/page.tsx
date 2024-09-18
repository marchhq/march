import { LogoDark } from "@/src/lib/icons/Logo"

const About = (): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-gray-color">
      <div className="flex flex-col items-center text-center">
        <LogoDark size={64} />
        <h1 className="mt-8 font-semibold">march for web</h1>
        <div className="mt-4 text-[17px] font-medium">
          <p>version: 1.0.1</p>
          <p>@ March Labs Inc, All rights reserved.</p>
        </div>
      </div>
      <div className="mt-12 flex flex-col space-y-4 text-sm font-semibold">
        <a
          href="https://x.com/_marchhq"
          target="_blank"
          className="hover:text-gray-100"
        >
          follow us on twitter
        </a>
        <a
          target="_blank"
          href="https://github.com/marchhq"
          className="hover:text-gray-100"
        >
          view our code
        </a>
        <a
          className="hover:text-gray-100"
          target="_blank"
          href="https://discord.com/invite/sugJGckV86"
        >
          join our discord
        </a>
        <a
          className="hover:text-gray-100"
          target="_blank"
          href="https://www.notion.so/77431d8a57e94977a1f27689f1944d25?v=96b8473a1a654111831782d9d6f9f2cc&cookie_sync_completed=true"
        >
          public wiki
        </a>
      </div>
    </div>
  )
}

export default About
