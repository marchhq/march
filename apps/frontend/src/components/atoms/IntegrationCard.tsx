import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { ArrowRight } from "@/src/lib/icons/ArrowRight"
import { LinearDark } from "@/src/lib/icons/LinearCircle"

export const IntegrationCard = (): JSX.Element => {
  return (
    <Card className="flex max-w-sm cursor-pointer justify-center rounded-md bg-background text-gray-color hover:text-gray-100">
      <div className="max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-start gap-2">
            <LinearDark />
            Linear
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Pull assigned issues directly to march— supports two way sync.</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <p>Connected</p>
          <span>
            <ArrowRight />
          </span>
        </CardFooter>
      </div>
    </Card>
  )
}
