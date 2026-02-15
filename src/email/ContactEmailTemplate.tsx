import { FileText, Mail, MessageSquare, User } from "lucide-react"

interface Props {
  name: string
  email: string
  subject: string
  message: string
}

export const ContactEmailTemplate = ({
  name,
  email,
  subject,
  message
}: Props) => {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-50 via-white to-gray-100 py-8 px-3 sm:py-14 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-lg sm:max-w-xl">
        <div className="h-1.5 w-full rounded-t-2xl bg-linear-to-r from-gray-300 via-gray-400 to-gray-300" />

        <div className="bg-white rounded-b-2xl shadow-[0_4px_32px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
          <div className="px-5 py-6 sm:px-8 sm:py-8 text-center border-b border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 mb-4">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight">
              Nuevo mensaje de contacto
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1.5 font-light">
              Se ha recibido un nuevo mensaje desde el formulario web
            </p>
          </div>

          <div className="px-5 py-5 sm:px-8 sm:py-7 space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="group relative bg-gray-50/70 rounded-xl p-4 border border-gray-100 transition hover:border-gray-200 hover:shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Nombre
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-800 font-medium leading-snug">
                  {name}
                </p>
              </div>

              <div className="group relative bg-gray-50/70 rounded-xl p-4 border border-gray-100 transition hover:border-gray-200 hover:shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Correo electrónico
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-800 font-medium leading-snug break-all">
                  {email}
                </p>
              </div>
            </div>

            <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-100 transition hover:border-gray-200 hover:shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Asunto
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-800 font-medium leading-snug">
                {subject}
              </p>
            </div>

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />
              <MessageSquare className="w-4 h-4 text-gray-300" />
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />
            </div>

            <div className="bg-gray-50/70 rounded-xl p-5 sm:p-6 border border-gray-100">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400">
                Mensaje
              </span>
              <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {message}
              </p>
            </div>
          </div>

          <div className="bg-gray-50/50 px-5 py-4 sm:px-8 sm:py-5 border-t border-gray-100 text-center">
            <p className="text-[10px] sm:text-xs text-gray-400 font-light leading-relaxed">
              Este correo fue generado automáticamente · No es necesario
              responder a este mensaje
            </p>
          </div>
        </div>

        <div className="mx-4 h-2 bg-linear-to-b from-gray-100/60 to-transparent rounded-b-xl" />
      </div>
    </div>
  )
}
