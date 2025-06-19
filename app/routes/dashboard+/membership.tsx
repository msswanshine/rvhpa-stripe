import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { z } from 'zod'
import { requireUser } from '#app/modules/auth/auth.server'

export const ROUTE_PATH = '/dashboard/membership' as const

export const UsernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .toLowerCase()
    .trim()
    .regex(/^[a-zA-Z0-9]+$/, 'Username may only contain alphanumeric characters.'),
})

export const meta: MetaFunction = () => {
  return [{ title: 'Membership' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request)
  return { user }
}

export default function DashboardMembership() {

  return (
    <div className="flex h-full w-full px-6 py-8">
      <div className="mx-auto flex h-full w-full max-w-screen-xl gap-12">
        {/* <div className="hidden w-full max-w-64 flex-col gap-0.5 lg:flex">
          <Link
            to={ROUTE_PATH}
            prefetch="intent"
            className={cn(
              `${buttonVariants({ variant: 'ghost' })} ${isMembershipPath && 'bg-primary/5'} justify-start rounded-md`,
            )}>
            <span
              className={cn(
                `text-sm text-primary/80 ${isMembershipPath && 'font-medium text-primary'}`,
              )}>
              General
            </span>
          </Link>
          <Link
            to={BILLING_PATH}
            prefetch="intent"
            className={cn(
              `${buttonVariants({ variant: 'ghost' })} ${isBillingPath && 'bg-primary/5'} justify-start rounded-md`,
            )}>
            <span
              className={cn(
                `text-sm text-primary/80 ${isBillingPath && 'font-medium text-primary'}`,
              )}>
              Billing
            </span>
          </Link>
        </div> */}

        <Outlet />
      </div>
    </div>
  )
}
