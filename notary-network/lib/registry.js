'use strict'

const namespaceRegistry = 'org.notary.network.registry'
const assetTypeRegistry = 'Registry'
const assetNSRegistry = namespaceRegistry + '.' + assetTypeRegistry

/**
 * @param {org.notary.network.registry.CreateRegistry} _transaction
 * @returns {org.notary.network.registry.Response}
 * @transaction
 */
async function createRegistry (_transaction) {
  const responseSuccess = getFactory().newConcept(
    namespaceRegistry,
    'ResponseSuccess'
  )
  const responseFailure = getFactory().newConcept(
    namespaceRegistry,
    'ResponseFailure'
  )
  try {
    const registryRegistry = await getAssetRegistry(assetNSRegistry)
    const newRegistry = await getFactory().newResource(
      namespaceRegistry,
      assetTypeRegistry,
      _transaction.id
    )

    newRegistry.id = _transaction.id
    newRegistry.cns = _transaction.cns
    newRegistry.lista_cns_permitida = _transaction.lista_cns_permitida
    newRegistry.specialidade = _transaction.specialidade
    newRegistry.livro = _transaction.livro
    newRegistry.numero_registro = _transaction.numero_registro
    newRegistry.data_registro = _transaction.data_registro
    newRegistry.protocolo = _transaction.protocolo
    newRegistry.natureza = _transaction.natureza
    newRegistry.subnatureza = _transaction.subnatureza
    newRegistry.guarda_conservacao = _transaction.guarda_conservacao
    newRegistry.sigilo_legal = _transaction.sigilo_legal
    newRegistry.atos = _transaction.atos
    newRegistry.objetos = _transaction.objetos

    let event = getFactory().newEvent(namespaceRegistry, 'CreateRegistryEvent')
    event.registry = newRegistry
    await registryRegistry.add(newRegistry)
    emit(event)
    return responseSuccess
  } catch (error) {
    responseFailure.statusCode = 500
    responseFailure.errorMessage = error.message
    return responseFailure
  }
}

/**
 * @param {org.notary.network.registry.UpdateRegistry} _transaction
 * @returns {org.notary.network.registry.Response}
 * @transaction
 */
async function updateRegistry (_transaction) {
  const responseSuccess = getFactory().newConcept(
    namespaceRegistry,
    'ResponseSuccess'
  )
  const responseFailure = getFactory().newConcept(
    namespaceRegistry,
    'ResponseFailure'
  )
  try {
    const registryRegistry = await getAssetRegistry(assetNSRegistry)
    const updateRegistry = await registryRegistry.get(_transaction.id)

    updateRegistry.cns = _transaction.cns
    updateRegistry.lista_cns_permitida = _transaction.lista_cns_permitida
    updateRegistry.specialidade = _transaction.specialidade
    updateRegistry.livro = _transaction.livro
    updateRegistry.numero_registro = _transaction.numero_registro
    updateRegistry.data_registro = _transaction.data_registro
    updateRegistry.protocolo = _transaction.protocolo
    updateRegistry.natureza = _transaction.natureza
    updateRegistry.subnatureza = _transaction.subnatureza
    updateRegistry.guarda_conservacao = _transaction.guarda_conservacao
    updateRegistry.sigilo_legal = _transaction.sigilo_legal
    updateRegistry.atos = _transaction.atos
    updateRegistry.objetos = _transaction.objetos

    let event = getFactory().newEvent(namespaceRegistry, 'UpdateRegistryEvent')
    event.registry = updateRegistry
    await registryRegistry.update(updateRegistry)
    emit(event)
    return responseSuccess
  } catch (error) {
    responseFailure.statusCode = 500
    responseFailure.errorMessage = error.message
    return responseFailure
  }
}
