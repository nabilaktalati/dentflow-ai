import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  CalendarDays,
  Check,
  LoaderCircle,
  MessageCircle,
  Search,
  Send,
  Stethoscope,
} from 'lucide-react'

import {
  getConversationMessages,
  getMessageContacts,
  sendMessage,
} from '../api/messagesApi.js'

const getContactName = (contact) =>
  `${contact?.firstName || ''} ${
    contact?.lastName || ''
  }`.trim()

const getInitials = (contact) => {
  const first =
    contact?.firstName?.charAt(0) || ''

  const last =
    contact?.lastName?.charAt(0) || ''

  return `${first}${last}`.toUpperCase()
}

const formatMessageTime = (value) => {
  if (!value) return ''

  return new Intl.DateTimeFormat(
    'tr-TR',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(new Date(value))
}

const formatAppointmentDate = (value) => {
  if (!value) return ''

  return new Intl.DateTimeFormat(
    'tr-TR',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(new Date(value))
}

function MessagesPage() {
  const [contacts, setContacts] =
    useState([])

  const [
    selectedContact,
    setSelectedContact,
  ] = useState(null)

  const [messages, setMessages] =
    useState([])

  const [content, setContent] =
    useState('')

  const [search, setSearch] =
    useState('')

  const [
    loadingContacts,
    setLoadingContacts,
  ] = useState(true)

  const [
    loadingMessages,
    setLoadingMessages,
  ] = useState(false)

  const [sending, setSending] =
    useState(false)

  const [error, setError] =
    useState('')

  const messagesEndRef =
    useRef(null)

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoadingContacts(true)
        setError('')

        const result =
          await getMessageContacts()

        setContacts(result)

        if (result.length > 0) {
          setSelectedContact(result[0])
        }
      } catch (err) {
        setError(
          err.message ||
            'Mesaj kişileri yüklenemedi.',
        )
      } finally {
        setLoadingContacts(false)
      }
    }

    loadContacts()
  }, [])

  useEffect(() => {
    if (
      !selectedContact?.recipientId
    ) {
      
      return
    }

    const loadMessages = async () => {
      try {
        setLoadingMessages(true)
        setError('')

const result =
  await getConversationMessages(
    selectedContact.recipientId,
  )

setMessages(result)

window.dispatchEvent(
  new CustomEvent(
    'dentflow:messages-read',
  ),
)
      } catch (err) {
        setError(
          err.message ||
            'Mesajlar yüklenemedi.',
        )
      } finally {
        setLoadingMessages(false)
      }
    }

    loadMessages()
  }, [selectedContact])

  useEffect(() => {
    messagesEndRef.current
      ?.scrollIntoView({
        behavior: 'smooth',
      })
  }, [messages])

  const filteredContacts =
    useMemo(() => {
      const query =
        search.trim().toLocaleLowerCase(
          'tr-TR',
        )

      if (!query) return contacts

      return contacts.filter(
        (contact) => {
          const text = [
            contact.firstName,
            contact.lastName,
            contact.title,
          ]
            .filter(Boolean)
            .join(' ')
            .toLocaleLowerCase(
              'tr-TR',
            )

          return text.includes(query)
        },
      )
    }, [contacts, search])

  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault()

    const trimmedContent =
      content.trim()

    if (
      !trimmedContent ||
      !selectedContact ||
      sending
    ) {
      return
    }

    try {
      setSending(true)
      setError('')

      const newMessage =
        await sendMessage({
          recipientId:
            selectedContact.recipientId,
          content: trimmedContent,
        })

      if (newMessage) {
        setMessages(
          (current) => [
            ...current,
            newMessage,
          ],
        )
      }

      setContent('')
    } catch (err) {
      setError(
        err.message ||
          'Mesaj gönderilemedi.',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1460px] px-5 pb-6 lg:px-6">
      {/* HEADER */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />

            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-600">
              Mesaj Merkezi
            </span>
          </div>

          <h1 className="mt-2 text-[27px] font-semibold tracking-[-0.04em] text-slate-950">
            Mesajlar
          </h1>

          <p className="mt-1 text-[13px] text-slate-500">
            Klinik iletişiminizi tek bir alanda yönetin.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* OUTER SAAS BUBBLE */}
      <div className="rounded-[34px] border border-white/80 bg-white/55 p-3 shadow-[0_24px_80px_rgba(79,70,229,0.10)] backdrop-blur-xl">
       <div className="grid h-[calc(100vh-285px)] min-h-[500px] max-h-[620px] gap-3 lg:grid-cols-[292px_minmax(0,1fr)]">
          {/* CONVERSATIONS BUBBLE */}
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.055)]">
            <div className="px-4 pb-3 pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-semibold tracking-[-0.01em] text-slate-950">
                    Konuşmalar
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Aktif iletişimler
                  </p>
                </div>

                <div className="flex h-7 min-w-7 items-center justify-center rounded-full bg-violet-50 px-2 text-[10px] font-bold text-violet-600">
                  {contacts.length}
                </div>
              </div>

              <div className="relative mt-4">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Kişi ara"
                  className="h-10 w-full rounded-full border border-slate-200 bg-slate-50/80 pl-9 pr-4 text-[12px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50"
                />
              </div>
            </div>

            <div className="mx-4 h-px bg-slate-100" />

            <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
              {loadingContacts ? (
                <div className="flex justify-center py-12">
                  <LoaderCircle
                    size={19}
                    className="animate-spin text-violet-600"
                  />
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <MessageCircle
                    size={22}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-xs font-medium text-slate-600">
                    Konuşma bulunamadı
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredContacts.map((contact) => {
                    const isSelected =
                      selectedContact?.recipientId ===
                      contact.recipientId

                    return (
                      <button
                        key={contact.recipientId}
                        type="button"
                        onClick={() =>
                          setSelectedContact(contact)
                        }
                        className={`relative w-full overflow-hidden rounded-[18px] px-3 py-3 text-left transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-violet-50 to-indigo-50 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.16)]'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-violet-600" />
                        )}

                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] text-[11px] font-bold ${
                              isSelected
                                ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {contact.profileImageUrl ? (
                              <img
                                src={contact.profileImageUrl}
                                alt=""
                                className="h-full w-full rounded-[14px] object-cover"
                              />
                            ) : (
                              getInitials(contact)
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="truncate text-[12px] font-semibold text-slate-900">
                                {getContactName(contact)}
                              </p>

                              {contact.role === 'DOCTOR' && (
                                <Stethoscope
                                  size={11}
                                  className="shrink-0 text-violet-500"
                                />
                              )}
                            </div>

                            <p className="mt-0.5 truncate text-[10px] text-slate-500">
                              {contact.role === 'DOCTOR'
                                ? contact.title || 'Diş Hekimi'
                                : 'Hasta'}
                            </p>

                            {contact.lastAppointmentAt && (
                              <div className="mt-1.5 flex items-center gap-1 text-[9px] text-slate-400">
                                <CalendarDays size={10} />

                                {formatAppointmentDate(
                                  contact.lastAppointmentAt,
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* CHAT BUBBLE */}
          <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.055)]">
            {!selectedContact ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                    <MessageCircle size={20} />
                  </div>

                  <p className="mt-3 text-[13px] font-semibold text-slate-800">
                    Bir konuşma seçin
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* FLOATING CHAT HEADER */}
                <div className="p-3 pb-0">
                  <header className="flex h-[62px] items-center justify-between rounded-[19px] border border-slate-100 bg-slate-50/70 px-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-white text-[11px] font-bold text-violet-700 shadow-sm">
                        {selectedContact.profileImageUrl ? (
                          <img
                            src={selectedContact.profileImageUrl}
                            alt=""
                            className="h-full w-full rounded-[13px] object-cover"
                          />
                        ) : (
                          getInitials(selectedContact)
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-[12px] font-semibold text-slate-950">
                            {getContactName(selectedContact)}
                          </p>

                          {selectedContact.role === 'DOCTOR' && (
                            <Stethoscope
                              size={12}
                              className="text-violet-500"
                            />
                          )}
                        </div>

                        <p className="mt-0.5 text-[10px] text-slate-500">
                          {selectedContact.role === 'DOCTOR'
                            ? selectedContact.title || 'Diş Hekimi'
                            : 'Hasta'}
                        </p>
                      </div>
                    </div>

                    <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-semibold text-emerald-700 sm:flex">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Bağlantı aktif
                    </div>
                  </header>
                </div>

                {/* CHAT BODY */}
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                  {loadingMessages ? (
                    <div className="flex h-full items-center justify-center">
                      <LoaderCircle
                        size={20}
                        className="animate-spin text-violet-600"
                      />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="max-w-[280px] text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] border border-violet-100 bg-gradient-to-br from-white to-violet-50 text-violet-600 shadow-[0_10px_30px_rgba(124,58,237,0.08)]">
                          <MessageCircle size={22} />
                        </div>

                        <h3 className="mt-4 text-[13px] font-semibold text-slate-800">
                          Yeni bir konuşma
                        </h3>

                        <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
                          İlk mesajınızı göndererek iletişimi
                          başlatabilirsiniz.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mx-auto max-w-3xl space-y-3">
                      {messages.map((message) => {
                        const incoming =
                          message.senderId ===
                          selectedContact.recipientId

                        return (
                          <div
                            key={message.id}
                            className={`flex ${
                              incoming
                                ? 'justify-start'
                                : 'justify-end'
                            }`}
                          >
                            <div
                              className={`max-w-[68%] px-3.5 py-2.5 text-[12px] leading-5 ${
                                incoming
                                  ? 'rounded-[18px] rounded-tl-[6px] border border-slate-200 bg-slate-50 text-slate-700'
                                  : 'rounded-[18px] rounded-tr-[6px] bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-100'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">
                                {message.content}
                              </p>

                              <div
                                className={`mt-1.5 flex items-center justify-end gap-1 text-[9px] ${
                                  incoming
                                    ? 'text-slate-400'
                                    : 'text-violet-200'
                                }`}
                              >
                                {formatMessageTime(
                                  message.createdAt,
                                )}

                                {!incoming && message.isRead && (
                                  <Check size={10} />
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}

                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* FLOATING COMPOSER */}
                <div className="shrink-0 px-4 pb-4 pt-2">
                  <form
                    onSubmit={handleSubmit}
                    className="mx-auto max-w-3xl"
                  >
                    <div className="flex items-end gap-2 rounded-[20px] border border-slate-200 bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,0.07)] transition focus-within:border-violet-300 focus-within:shadow-[0_10px_35px_rgba(124,58,237,0.10)]">
                      <textarea
                        value={content}
                        onChange={(event) =>
                          setContent(event.target.value)
                        }
                        rows={1}
                        maxLength={2000}
                        placeholder="Bir mesaj yazın..."
                        className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-3 py-2.5 text-[12px] text-slate-900 outline-none placeholder:text-slate-400"
                      />

                      <button
                        type="submit"
                        disabled={sending || !content.trim()}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {sending ? (
                          <LoaderCircle
                            size={15}
                            className="animate-spin"
                          />
                        ) : (
                          <Send size={15} />
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  )

}

export default MessagesPage