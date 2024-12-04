import { Link } from 'react-router'
import { LogoDark } from './components/icons/logo'
import GoogleLogin from './components/login/google'
import { GithubLogin } from './components/login/github'

function App(): JSX.Element {
  return (
    <section className="h-screen">
      <div className="p-9">
        <LogoDark size={40} />
      </div>
      <main className="grid h-[calc(100vh-350px)] place-items-center bg-background text-center text-muted">
        <div className="flex w-full max-w-7xl flex-col items-center justify-between">
          <div className="flex flex-col items-center justify-center gap-12">
            <div className="flex flex-col text-left font-medium text-secondary-foreground">
              <h1>for makers</h1>
              <h1 className="text-primary-foreground">to get things done.</h1>
            </div>
            <div className="flex w-full flex-col items-center gap-4 text-base">
              <GoogleLogin />
              <GithubLogin />
            </div>
          </div>
        </div>
      </main>
      <div className="absolute inset-x-0 bottom-8">
        <div className="mx-auto w-full max-w-lg text-xs text-gray-color">
          <div className="text-center">
            <p>By continuing, you agree to our </p>
            <p>
              <span className="text-gray-100">
                <Link
                  target="_blank"
                  to="https://marchhq.notion.site/Terms-Privacy-67fb3e8525c04fcfa73dca152ecc1dec"
                >
                  terms of services
                </Link>
              </span>{' '}
              and our{' '}
              <span className="text-gray-100">
                <Link
                  target="_blank"
                  to="https://marchhq.notion.site/Terms-Privacy-67fb3e8525c04fcfa73dca152ecc1dec"
                >
                  privacy policy.
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default App
