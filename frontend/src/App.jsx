import { motion } from 'motion/react'
import { Activity } from 'lucide-react'
import { Link } from 'react-router'

function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Activity className="mx-auto mb-4 size-10 text-cyan-400" />

        <h1 className="text-4xl font-bold">
          DentFlow AI
        </h1>

        <p className="mt-3 text-slate-400">
          Akıllı Diş Kliniği Yönetim Platformu
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-cyan-400 px-5 py-2.5 font-medium text-slate-950"
        >
          Sistem Hazır
        </Link>
      </motion.div>
    </main>
  )
}

export default App