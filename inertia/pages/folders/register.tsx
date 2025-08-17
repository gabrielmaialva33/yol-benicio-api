import React from 'react'
import { Head, useForm } from '@inertiajs/react'
import type { PageProps } from '@adonisjs/inertia/types'
import DashboardLayout from '../dashboard/layout'

interface FolderRegisterProps extends PageProps {
  clients?: Array<{
    id: number
    full_name: string
    email: string
    code?: string
  }>
  lawyers?: Array<{
    id: number
    full_name: string
    email: string
  }>
}

const areas = [
  { value: '', label: 'Selecione uma área' },
  { value: 'civil_litigation', label: 'Cível Contencioso' },
  { value: 'labor', label: 'Trabalhista' },
  { value: 'tax', label: 'Tributário' },
  { value: 'criminal', label: 'Criminal' },
  { value: 'administrative', label: 'Administrativo' },
  { value: 'consumer', label: 'Consumidor' },
  { value: 'family', label: 'Família' },
  { value: 'corporate', label: 'Empresarial' },
  { value: 'environmental', label: 'Ambiental' },
  { value: 'intellectual_property', label: 'Propriedade Intelectual' },
  { value: 'real_estate', label: 'Imobiliário' },
  { value: 'international', label: 'Internacional' },
]

const statuses = [
  { value: 'active', label: 'Ativo' },
  { value: 'pending', label: 'Pendente' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'archived', label: 'Arquivado' },
]

export default function FolderRegister({ clients = [], lawyers = [] }: FolderRegisterProps) {
  const { data, setData, post, processing, errors } = useForm({
    code: '',
    title: '',
    description: '',
    status: 'active',
    area: '',
    court: '',
    case_number: '',
    opposing_party: '',
    client_id: '',
    responsible_lawyer_id: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/folders')
  }

  return (
    <DashboardLayout title="Cadastro de Pasta">
      <Head title="Cadastro de Pasta" />

      <div className="p-4 sm:p-6 lg:p-8 bg-[#F1F1F2] min-h-full">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nova Pasta</h1>
                <p className="text-gray-600 mt-1">Cadastrar uma nova pasta jurídica</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Informações Básicas</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Código da Pasta *
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: 2024-001"
                    required
                  />
                  {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    id="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Título descritivo da pasta"
                    required
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descrição detalhada da pasta..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                    Área Jurídica *
                  </label>
                  <select
                    id="area"
                    value={data.area}
                    onChange={(e) => setData('area', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {areas.map((area) => (
                      <option key={area.value} value={area.value}>
                        {area.label}
                      </option>
                    ))}
                  </select>
                  {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
                </div>
              </div>
            </div>

            {/* Process Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Informações do Processo</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="court" className="block text-sm font-medium text-gray-700 mb-2">
                    Tribunal/Vara
                  </label>
                  <input
                    type="text"
                    id="court"
                    value={data.court}
                    onChange={(e) => setData('court', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: 1ª Vara Cível de São Paulo"
                  />
                  {errors.court && <p className="mt-1 text-sm text-red-600">{errors.court}</p>}
                </div>

                <div>
                  <label
                    htmlFor="case_number"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Número do Processo
                  </label>
                  <input
                    type="text"
                    id="case_number"
                    value={data.case_number}
                    onChange={(e) => setData('case_number', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0000000-00.0000.0.00.0000"
                  />
                  {errors.case_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.case_number}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="opposing_party"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Parte Contrária
                  </label>
                  <input
                    type="text"
                    id="opposing_party"
                    value={data.opposing_party}
                    onChange={(e) => setData('opposing_party', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome da parte contrária"
                  />
                  {errors.opposing_party && (
                    <p className="mt-1 text-sm text-red-600">{errors.opposing_party}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Responsible Parties */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Responsáveis</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="client_id"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Cliente
                  </label>
                  <select
                    id="client_id"
                    value={data.client_id}
                    onChange={(e) => setData('client_id', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id.toString()}>
                        {client.full_name} {client.code && `(${client.code})`}
                      </option>
                    ))}
                  </select>
                  {errors.client_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.client_id}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="responsible_lawyer_id"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Advogado Responsável
                  </label>
                  <select
                    id="responsible_lawyer_id"
                    value={data.responsible_lawyer_id}
                    onChange={(e) => setData('responsible_lawyer_id', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um advogado</option>
                    {lawyers.map((lawyer) => (
                      <option key={lawyer.id} value={lawyer.id.toString()}>
                        {lawyer.full_name}
                      </option>
                    ))}
                  </select>
                  {errors.responsible_lawyer_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.responsible_lawyer_id}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => window.history.back()}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {processing ? 'Salvando...' : 'Salvar Pasta'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
