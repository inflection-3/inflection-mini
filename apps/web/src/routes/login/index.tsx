import { DynamicEmbeddedAuthFlow,} from '@dynamic-labs/sdk-react-core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login/')({
  component: LoginComponent,
})

function LoginComponent() {
    return <main className='h-[calc(100vh-130px)] flex items-center justify-center'>
        <DynamicEmbeddedAuthFlow />
    </main>
}
