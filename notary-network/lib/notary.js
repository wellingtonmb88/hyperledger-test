'use strict'

const namespaceNotary = 'org.notary.network.notary'
const assetTypeNotary = 'Notary'
const assetNSNotary = namespaceNotary + '.' + assetTypeNotary

/**
 * @param {org.notary.network.notary.CreateNotary} _transaction
 * @returns {org.notary.network.notary.Response}
 * @transaction
 */
async function createNotary (_transaction) {
  const responseSuccess = getFactory().newConcept(
    namespaceNotary,
    'ResponseSuccess'
  )
  const responseFailure = getFactory().newConcept(
    namespaceNotary,
    'ResponseFailure'
  )
  console.log('createNotary')
  try {
    const notaryRegistry = await getParticipantRegistry(assetNSNotary)
    const newNotary = await getFactory().newResource(
      namespaceNotary,
      assetTypeNotary,
      _transaction.cns
    )
    newNotary.cns = _transaction.cns
    newNotary.name = _transaction.name
    newNotary.date = _transaction.date
    newNotary.active = _transaction.active

    let event = getFactory().newEvent(namespaceNotary, 'CreateNotaryEvent')
    event.notary = newNotary
    await notaryRegistry.add(newNotary)
    emit(event)
    return responseSuccess
  } catch (error) {
    responseFailure.statusCode = 500
    responseFailure.errorMessage = error.message
    return responseFailure
  }
}

/**
 * @param {org.notary.network.notary.UpdateNotary} _transaction
 * @returns {org.notary.network.notary.Response}
 * @transaction
 */
async function updateNotary (_transaction) {
  const responseSuccess = getFactory().newConcept(
    namespaceNotary,
    'ResponseSuccess'
  )
  const responseFailure = getFactory().newConcept(
    namespaceNotary,
    'ResponseFailure'
  )
  try {
    const notaryRegistry = await getParticipantRegistry(assetNSNotary)
    const updateNotary = await notaryRegistry.get(_transaction.cns)
    updateNotary.name = _transaction.name
    updateNotary.date = _transaction.date
    updateNotary.active = _transaction.active

    let event = getFactory().newEvent(namespaceNotary, 'UpdateNotaryEvent')
    event.notary = updateNotary
    await notaryRegistry.update(updateNotary)
    emit(event)
    return responseSuccess
  } catch (error) {
    responseFailure.statusCode = 500
    responseFailure.errorMessage = error.message
    return responseFailure
  }
}

/**
 * @param {org.notary.network.notary.RemoveNotary} _transaction
 * @returns {org.notary.network.notary.Response}
 * @transaction
 */
async function removeNotary (_transaction) {
  const responseSuccess = getFactory().newConcept(
    namespaceNotary,
    'ResponseSuccess'
  )
  const responseFailure = getFactory().newConcept(
    namespaceNotary,
    'ResponseFailure'
  )
  try {
    const notaryRegistry = await getParticipantRegistry(assetNSNotary)
    const notary = await notaryRegistry.get(_transaction.cns)
    let event = getFactory().newEvent(namespaceNotary, 'RemoveNotaryEvent')
    event.notary = notary
    await notaryRegistry.remove(notary)
    emit(event)
    return responseSuccess
  } catch (error) {
    responseFailure.statusCode = 500
    responseFailure.errorMessage = error.message
    return responseFailure
  }
}

/**
 * @param {org.notary.network.notary.InactivateNotary} _transaction
 * @returns {org.notary.network.notary.Response}
 * @transaction
 */
async function inactivateNotary (_transaction) {
  const responseSuccess = getFactory().newConcept(
    namespaceNotary,
    'ResponseSuccess'
  )
  const responseFailure = getFactory().newConcept(
    namespaceNotary,
    'ResponseFailure'
  )
  try {
    const cns = _transaction.cns
    const notaryRegistry = await getParticipantRegistry(assetNSNotary)
    const notary = await notaryRegistry.get(cns)

    notary.active = false

    let event = getFactory().newEvent(
      'org.notary.network.notary',
      'InactivateNotaryEvent'
    )
    event.notary = notary
    emit(event)
    await notaryRegistry.update(notary)
    return responseSuccess
  } catch (error) {
    responseFailure.statusCode = 500
    responseFailure.errorMessage = error.message
    return responseFailure
  }
}
