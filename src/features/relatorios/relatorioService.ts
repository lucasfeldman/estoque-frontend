import { api } from '../../lib/api'

export async function listaPrecos(): Promise<any> {
  const { data } = await api.get('/relatorios/lista-precos')
  return data
}

export async function balanco(): Promise<any> {
  const { data } = await api.get('/relatorios/balanco')
  return data
}

export async function abaixoMinimo(): Promise<any> {
  const { data } = await api.get('/relatorios/abaixo-minimo')
  return data
}

export async function porCategoria(): Promise<any> {
  const { data } = await api.get('/relatorios/por-categoria')
  return data
}