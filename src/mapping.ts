import { BigInt, DataSourceContext, log } from "@graphprotocol/graph-ts"

import {
  PeriodicPrizePool,
  PrizePoolBuilder,
  PrizePoolModuleManager
} from '../generated/schema'

import { PrizePoolCreated } from '../generated/PrizePoolBuilder/PrizePoolBuilder'
import {
  PrizePoolModuleManager as PrizePoolModuleManagerContract,
} from '../generated/PrizePoolBuilder/PrizePoolModuleManager'

import { PeriodicPrizePool as PeriodicPrizePoolTemplate } from '../generated/templates'
import { PrizePoolOpened } from '../generated/templates/PeriodicPrizePool/PeriodicPrizePool'

export function handlePrizePoolCreated(event: PrizePoolCreated): void {
  log.warning('PrizePoolCreated `event.address`:, {}', [event.address.toHex()])

  let prizePoolBuilder = PrizePoolBuilder.load(event.address.toHex())

  if (!prizePoolBuilder) {
    prizePoolBuilder = new PrizePoolBuilder(event.address.toHex())
    prizePoolBuilder.save()
  }

  let prizePoolModuleManager = PrizePoolModuleManager.load(event.params.moduleManager.toHex())

  if (!prizePoolModuleManager) {
    prizePoolModuleManager = new PrizePoolModuleManager(event.params.moduleManager.toHex())
    const boundPrizePoolModuleManager = PrizePoolModuleManagerContract.bind(event.params.moduleManager)

    log.warning('PrizePoolAddress!, {}', [boundPrizePoolModuleManager.prizePool().toHexString()])

    log.warning('Here ! address?, {}', [boundPrizePoolModuleManager.prizePool().toHexString()])

    // Store Dynamically generated contracts
    PeriodicPrizePoolTemplate.create(boundPrizePoolModuleManager.prizePool())
    // let context = new DataSourceContext()
    // context.setBytes("prizePoolModuleManager", event.params.moduleManager)
    // PeriodicPrizePool.createWithContext(boundPrizePoolModuleManager.prizePool(), context)

    const prizePool = new PeriodicPrizePool(boundPrizePoolModuleManager.prizePool().toHex())
    prizePool.prizePoolModuleManager = event.params.moduleManager.toHex()
    prizePool.number = BigInt.fromI32(2)
    prizePool.save()

    prizePoolModuleManager.prizePoolBuilder = event.address.toHex()
    prizePoolModuleManager.save()
    log.warning('Saved! Saved! Saved! Saved! , {}', [boundPrizePoolModuleManager.prizePool().toHexString()])
  }
}

export function handlePrizePoolOpened(event: PrizePoolOpened): void {
  log.warning('event.address!, {}', [event.address.toHex()])
  log.warning('startedAt?, {}', [event.params.prizePeriodStartedAt.toHexString()])
  log.warning('PeriodicPrizePoolAddress ?, {}', [event.address.toHexString()])

  const p = PeriodicPrizePool.load(event.address.toHex())
  p.number = BigInt.fromI32(5)
  p.save()
}
