import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { ArrowRight } from "@/src/lib/icons/ArrowRight"
import { LinearCircle } from "@/src/lib/icons/LinearCircle"

export const IntegrationCard = (): JSX.Element => {
  return (
    <Card className="flex max-w-sm justify-center rounded-md border border-[#DCDCDD] text-gray-color">
      <div className="max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-start gap-2 text-[#3A3A3A]">
            <LinearCircle />
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
