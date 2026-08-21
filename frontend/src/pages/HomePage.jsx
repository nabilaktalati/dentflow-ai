import { useEffect, useState } from 'react'
import { CheckCircle2, Server } from 'lucide-react'

import { getHealth } from '../services/api.js'

function HomePage() {
  const [status, setStatus] = useState('loading')
  const [apiMessage, setApiMessage] = useState('')

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await getHealth()

        setApiMessage(response.message)
        setStatus('success')
      } catch (error) {
        console.error(error)
        setStatus('error')
      }
    }

    checkApi()
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="text-center">
        <Server className="mx-auto mb-5 size-10 text-cyan-400" />

        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
          DentFlow AI
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Full-Stack System Check
        </h1>

        {status === 'loading' && (
          <p className="mt-6 text-slate-400">
            API bağlantısı kontrol ediliyor...
          </p>
        )}

        {status === 'success' && (
          <div className="mt-6 flex items-center justify-center gap-2 text-emerald-400">
            <CheckCircle2 className="size-5" />
            <span>API Bağlantısı Başarılı</span>
          </div>
        )}

        {apiMessage && (
          <p className="mt-3 text-slate-400">
            {apiMessage}
          </p>
        )}

        {status === 'error' && (
          <p className="mt-6 text-red-400">
            API bağlantısı başarısız.
          </p>
        )}
      </div>
    </main>
  )
}

export default HomePage