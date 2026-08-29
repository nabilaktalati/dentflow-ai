import {
  CalendarDays,
  CalendarOff,
  Clock3,
} from 'lucide-react'

import {
  useState,
} from 'react'

import {
  motion,
} from 'motion/react'
import DoctorSchedulePanel from '../components/DoctorSchedulePanel.jsx'
import DoctorSpecialDaysPanel from '../components/DoctorSpecialDaysPanel.jsx'
import DoctorAppointmentsList from '../components/DoctorAppointmentsList.jsx'
const tabs = [
  {
    id: 'appointments',
    label: 'Randevularım',
    icon: CalendarDays,
  },
  {
    id: 'schedule',
    label: 'Çalışma Saatlerim',
    icon: Clock3,
  },
  {
    id: 'exceptions',
    label: 'Özel Günler',
    icon: CalendarOff,
  },
]


export default function DoctorAppointmentsPage() {
  const [
    activeTab,
    setActiveTab,
  ] = useState('schedule')


  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#625BF6]">
          Doktor Paneli
        </p>

        <h1 className="mt-2 text-[38px] font-bold leading-[1.05] tracking-[-0.04em] text-[#101828] sm:text-[42px]">
          Randevular
        </h1>

        <p className="mt-3 max-w-[680px] text-[14px] leading-6 text-[#6F7A8E]">
          Randevularınızı, haftalık çalışma programınızı ve özel günlerinizi tek alandan yönetin.
        </p>
      </motion.div>


      <div className="mt-7 flex w-fit max-w-full gap-1 overflow-x-auto rounded-[16px] border border-[#E7E5F2] bg-white/80 p-1.5 shadow-sm">
        {tabs.map((tab) => {
          const Icon =
            tab.icon

          const isActive =
            activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  tab.id,
                )
              }
              className={`flex h-10 shrink-0 items-center gap-2 rounded-[11px] px-4 text-[12px] font-semibold transition ${
                isActive
                  ? 'bg-[#625BF6] text-white shadow-[0_8px_20px_rgba(98,91,246,0.20)]'
                  : 'text-[#667085] hover:bg-[#F7F6FC] hover:text-[#344054]'
              }`}
            >
              <Icon
                size={15}
                strokeWidth={1.9}
              />

              {tab.label}
            </button>
          )
        })}
      </div>


      <div className="mt-6">
        {activeTab ===
  'appointments' && (
    <DoctorAppointmentsList />
)}

        {activeTab ===
  'schedule' && (
  <DoctorSchedulePanel />
)}

        {activeTab ===
  'exceptions' && (
  <DoctorSpecialDaysPanel />
)}
      </div>
    </div>
  )
}