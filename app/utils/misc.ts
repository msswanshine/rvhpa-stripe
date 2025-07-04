import type { ClassValue } from 'clsx'
import type { loader } from '#app/root'
import { useFormAction, useNavigation, useRouteLoaderData } from '@remix-run/react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS classnames with support for conditional classes.
 * Widely used for Radix components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Use root-loader data.
 */
type RootLoaderData = Awaited<ReturnType<typeof loader>>

function isUser(user: RootLoaderData['data']['user']) {
  return user && typeof user === 'object' && typeof user.id === 'string'
}

export function useOptionalUser() {
  const loaderData = useRouteLoaderData<RootLoaderData>('root')
  if (!loaderData || !isUser(loaderData.data.user)) return undefined
  return loaderData.data.user
}

export function useUser() {
  const optionalUser = useOptionalUser()
  if (!optionalUser) throw new Error('No user found in root loader.')
  return optionalUser
}

/**
 * Permissions.
 * Implementation based on github.com/epicweb-dev/epic-stack
 */
export type RoleName = 'user' | 'admin'

export function userHasRole(
  user: Pick<ReturnType<typeof useUser>, 'roles'> | null,
  role: RoleName,
) {
  if (!user) return false
  return user.roles.some((r: { name: string }) => r.name === role)
}

/**
 * Get the user's image src.
 */
export function getUserImgSrc(imageId?: string | null) {
  return imageId ? `/resources/user-images/${imageId}` : ''
}

/**
 * Use the current route's form action.
 * Checks if the current route's form is being submitted.
 *
 * @default formMethod is POST.
 * @default state is non-idle.
 */
export function useIsPending({
  formAction,
  formMethod = 'POST',
  state = 'non-idle',
}: {
  formAction?: string
  formMethod?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'
  state?: 'submitting' | 'loading' | 'non-idle'
} = {}) {
  const contextualFormAction = useFormAction()
  const navigation = useNavigation()
  const isPendingState =
    state === 'non-idle' ? navigation.state !== 'idle' : navigation.state === state
  return (
    isPendingState &&
    navigation.formAction === (formAction ?? contextualFormAction) &&
    navigation.formMethod === formMethod
  )
}

/**
 * Returns a function that calls all of its arguments.
 */
export function callAll<Args extends Array<unknown>>(
  ...fns: Array<((...args: Args) => unknown) | undefined>
) {
  return (...args: Args) => fns.forEach((fn) => fn?.(...args))
}
