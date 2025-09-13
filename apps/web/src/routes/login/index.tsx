import { DynamicEmbeddedAuthFlow,} from '@dynamic-labs/sdk-react-core'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login/')({
  component: LoginComponent,
  beforeLoad: async ({ context }) => {
    const { auth} = context;
    if (auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
    return { auth };
  },
})

function LoginComponent() {
    return <main className='h-[calc(100vh-130px)] flex items-center justify-center'>
        <DynamicEmbeddedAuthFlow />
    </main>
}
