import {
  useState,
} from 'react'

import {
  ArrowUpRight,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router'

import Button from '../../../components/ui/Button.jsx'

import {
  useAuth,
} from '../context/authContext.js'

import BookingAuthModal from './BookingAuthModal.jsx'


export default function BookingCTA({
  size = 'sm',
  className = '',
  children = 'Randevu Al',
}) {
  const navigate = useNavigate()

  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth()

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false)


  const handleClick = () => {
    if (isAuthLoading) {
      return
    }

    if (isAuthenticated) {
      navigate('/doctors')
      return
    }

    setModalOpen(true)
  }


  return (
    <>
      <Button
        type="button"
        size={size}
        onClick={handleClick}
        className={className}
      >
        {children}

        <ArrowUpRight
          className="size-4"
        />
      </Button>

      <BookingAuthModal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
      />
    </>
  )
}