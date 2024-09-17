import { Heading } from "@/src/components/atoms/Heading"

const About = (): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-gray-color">
      <div className="w-full max-w-4xl">
        <Heading label="Account" />
        <div className="mt-8 rounded-md p-8 shadow-md">
          <div className="flex flex-col items-center space-y-8">
            <div className="flex w-full items-start rounded-md bg-background-active p-4">
              <p className="w-1/3 text-left text-lg font-semibold">
                Profile Picture
              </p>
              <div className="flex w-2/3 justify-start">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Profile"
                  className="size-32 rounded-full object-cover"
                />
              </div>
            </div>

            {/* Email and other boxes */}
            <div className="w-full space-y-4">
              <div className="flex justify-between">
                <p className="text-lg font-semibold">Email</p>
                <p className="flex h-10 w-64 items-center rounded-md bg-background-active px-3 py-2 text-left shadow-md">
                  user@example.com
                </p>
              </div>

              <div className="flex justify-between pt-8">
                <p className="text-lg font-semibold">Full name</p>
                <p className="flex h-10 w-64 items-center rounded-md bg-background-active px-3 py-2 text-left shadow-md">
                  Oliur Sahin
                </p>
              </div>

              <div className="flex justify-between pt-8">
                <p className="text-lg font-semibold">Username</p>
                <p className="flex h-10 w-64 items-center rounded-md bg-background-active px-3 py-2 text-left shadow-md">
                  sahin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
