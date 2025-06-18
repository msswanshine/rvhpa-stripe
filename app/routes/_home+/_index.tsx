import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { detectBot } from '@arcjet/remix'
import { authenticator } from '#app/modules/auth/auth.server'
import { cn } from '#app/utils/misc'
import { siteConfig } from '#app/utils/constants/brand'
import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/auth+/login'
import { buttonVariants } from '#app/components/ui/button'
import arcjet from '#app/utils/arcjet.server'

import { Logo } from '#app/components/logo'
import Layout from '#app/components/Layout'

export const meta: MetaFunction = () => {
  return [{ title: `${siteConfig.siteTitle} - Starter Kit` }]
}

// Add rules to the base Arcjet instance outside of the handler function.
const aj = arcjet.withRule(
  detectBot({
    // Will block requests. Use "DRY_RUN" to log only.
    mode: 'LIVE',
    // Configured with a list of bots to allow from https://arcjet.com/bot-list.
    // Blocks all bots except monitoring services and search engines.
    allow: ['CATEGORY:MONITOR', 'CATEGORY:SEARCH_ENGINE'],
  }),
)

export async function loader(args: LoaderFunctionArgs) {
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(args)

    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        // Distinguish between bots and other errors,
        // in case you want to show a custom message.
        throw new Response('Forbidden', {
          status: 403,
        })
      } else {
        throw new Response('Not allowed', {
          status: 403,
        })
      }
    }
  }

  const sessionUser = await authenticator.isAuthenticated(args.request)
  return { user: sessionUser }
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div className="relative flex h-full w-full flex-col bg-card">
      {/* Navigation */}
      <nav
        className={cn(
          'sticky top-1.5 z-50 mx-auto flex w-full max-w-screen-lg items-center justify-between rounded-lg bg-card/20 p-6 py-3 backdrop-blur transition-all duration-300 dark:bg-secondary/20',
        )}>
        <Link to="/" prefetch="intent" className="flex h-10 items-center gap-1">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <Link to={LOGIN_PATH} className={cn(buttonVariants({ size: 'sm' }), 'h-8')}>
            {user ? 'Dashboard' : 'Get Started'}
          </Link>
        </div>
      </nav>
      <Layout>
        <div className="mx-auto max-w-7xl">
          <div className="px-5 md:px-10">
            <h1 className="text-4xl font-bold pt-40">
              Rogue Valley Hang Gliding and Paragliding Association
            </h1>
            <p>
              Welcome to our new website!
            </p>
          </div>
        </div>
      </Layout>
    </div>
  )
}
