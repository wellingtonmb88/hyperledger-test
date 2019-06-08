'use strict'

const namespaceObserver = 'org.notary.network.observer'
const assetTypeObserver = 'Observer'
const assetNSObserver = namespaceObserver + '.' + assetTypeObserver

/**
 * @param {org.notary.network.observer.CreateObserver} _transaction
 * @returns {org.notary.network.observer.Response}
 * @transaction
 */
async function createObserver (_transaction) {
  const responseSuccess = getFactory().newConcept(
    namespaceObserver,
    'ResponseSuccess'
  )
  const responseFailure = getFactory().newConcept(
    namespaceObserver,
    'ResponseFailure'
  )
  try {
    const observerRegistry = await getParticipantRegistry(assetNSObserver)
    const newObserver = await getFactory().newResource(
      namespaceObserver,
      assetTypeObserver,
      _transaction.id
    )
    newObserver.id = _transaction.id
    newObserver.name = _transaction.name
    newObserver.date = _transaction.date
    newObserver.active = _transaction.active

    let event = getFactory().newEvent(namespaceObserver, 'CreateObserverEvent')
    event.observer = newObserver
    await observerRegistry.add(newObserver)
    emit(event)
    return responseSuccess
  } catch (error) {
    responseFailure.statusCode = 500
    responseFailure.errorMessage = error.message
    return responseFailure
  }
}

/**
 * @param {org.notary.network.observer.UpdateObserver} _transaction
 * @returns {org.notary.network.observer.Response}
 * @transaction
 */
async function updateObserver (_transaction) {
  const responseSuccess = getFactory().newConcept(
    namespaceObserver,
    'ResponseSuccess'
  )
  const responseFailure = getFactory().newConcept(
    namespaceObserver,
    'ResponseFailure'
  )
  try {
    const observerRegistry = await getParticipantRegistry(assetNSObserver)
    const updateObserver = await observerRegistry.get(_transaction.id)
    updateObserver.name = _transaction.name
    updateObserver.date = _transaction.date
    updateObserver.active = _transaction.active

    let event = getFactory().newEvent(namespaceObserver, 'UpdateObserverEvent')
    event.observer = updateObserver
    await observerRegistry.update(updateObserver)
    emit(event)
    return responseSuccess
  } catch (error) {
    responseFailure.statusCode = 500
    responseFailure.errorMessage = error.message
    return responseFailure
  }
}

/**
 * @param {org.notary.network.observer.RemoveObserver} _transaction
 * @returns {org.notary.network.observer.Response}
 * @transaction
 */
async function removeObserver (_transaction) {
  const responseSuccess = getFactory().newConcept(
    namespaceObserver,
    'ResponseSuccess'
  )
  const responseFailure = getFactory().newConcept(
    namespaceObserver,
    'ResponseFailure'
  )
  try {
    const observerRegistry = await getParticipantRegistry(assetNSObserver)
    const observer = await observerRegistry.get(_transaction.id)
    let event = getFactory().newEvent(namespaceObserver, 'RemoveObserverEvent')
    event.observer = observer
    await observerRegistry.remove(observer)
    emit(event)
    return responseSuccess
  } catch (error) {
    responseFailure.statusCode = 500
    responseFailure.errorMessage = error.message
    return responseFailure
  }
}

/**
 * @param {org.notary.network.observer.InactivateObserver} _transaction
 * @returns {org.notary.network.observer.Response}
 * @transaction
 */
async function inactivateObserver (_transaction) {
  const responseSuccess = getFactory().newConcept(
    namespaceObserver,
    'ResponseSuccess'
  )
  const responseFailure = getFactory().newConcept(
    namespaceObserver,
    'ResponseFailure'
  )
  try {
    const id = _transaction.id
    const observerRegistry = await getParticipantRegistry(assetNSObserver)
    const observer = await observerRegistry.get(id)

    observer.active = false

    let event = getFactory().newEvent(
      'org.notary.network.observer',
      'InactivateObserverEvent'
    )
    event.observer = observer
    emit(event)
    await observerRegistry.update(observer)
    return responseSuccess
  } catch (error) {
    responseFailure.statusCode = 500
    responseFailure.errorMessage = error.message
    return responseFailure
  }
}
