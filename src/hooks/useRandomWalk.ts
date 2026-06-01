import { useState, useEffect, useCallback, useRef } from 'react'
import type { CharacterPosition, FurnitureItem } from '../types'
import { INTERACTION_PHRASES } from '../data/interactions'
import { boyPhrases, girlPhrases, boyCouplePhrases, girlCouplePhrases } from '../data/phrases'
import { ROOMS } from '../data/rooms'
import type { RoomData } from '../data/rooms'

const MAP_WIDTH = 100
const MAP_HEIGHT = 100
const STEP_SIZE = 2
const MOVE_INTERVAL = 3000
const PAUSE_DURATION = 3000
const FURNITURE_INTERACT_DURATION = 5000
const COUPLE_INTERACT_DURATION = 10000
const FURNITURE_INTERACT_CHANCE = 0.35
const FURNITURE_INTERACT_COOLDOWN = 15000
const COUPLE_DISTANCE = 15
const LOCAL_WANDER_DURATION = 20000
const TARGET_STEP_SIZE = 2
const TARGET_MOVE_INTERVAL = 800
const TARGET_REACH_THRESHOLD = 3

export function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function isInBounds(x: number, y: number): boolean {
  return x >= 0 && x <= MAP_WIDTH && y >= 0 && y <= MAP_HEIGHT
}

function distance(a: CharacterPosition, b: CharacterPosition): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function getFurnitureDetectionRadius(f: FurnitureItem): number {
  return Math.sqrt(f.width * f.width + f.height * f.height) / 2 + 3
}

function findFurnitureNearby(
  pos: CharacterPosition,
  furniture: FurnitureItem[]
): FurnitureItem | null {
  let nearest: FurnitureItem | null = null
  let bestScore = Infinity

  for (const f of furniture) {
    const cx = f.x + f.width / 2
    const cy = f.y + f.height / 2
    const d = distance(pos, { x: cx, y: cy })
    const radius = getFurnitureDetectionRadius(f)

    if (d < radius) {
      const score = d / radius
      if (score < bestScore) {
        bestScore = score
        nearest = f
      }
    }
  }

  return nearest
}

function getFurniturePhrase(nearF: FurnitureItem, isBoy: boolean): string {
  const phrases = INTERACTION_PHRASES[nearF.id]
  if (!phrases) return isBoy ? getRandomItem(boyPhrases) : getRandomItem(girlPhrases)
  const list = isBoy ? phrases.boy : phrases.girl
  return getRandomItem(list)
}

function randomPointInRoom(room: RoomData): CharacterPosition {
  const margin = 6
  return {
    x: room.x + margin + Math.random() * Math.max(room.w - margin * 2, 1),
    y: room.y + margin + Math.random() * Math.max(room.h - margin * 2, 1),
  }
}

export interface WalkCallbacks {
  onAutoFurnitureInteract?: (furniture: FurnitureItem) => boolean
}

export function useRandomWalk(
  furniture: FurnitureItem[],
  initialPosition: CharacterPosition,
  isBoy: boolean,
  callbacks?: WalkCallbacks
) {
  const [position, setPosition] = useState<CharacterPosition>(initialPosition)
  const [showBubble, setShowBubble] = useState(false)
  const [bubbleText, setBubbleText] = useState('')
  const [isWalking, setIsWalking] = useState(false)
  const [isFurnitureInteraction, setIsFurnitureInteraction] = useState(false)
  const [activeTimerCount, setActiveTimerCount] = useState(0)

  const runIdRef = useRef(0)
  const moveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const activeTimerCountRef = useRef(0)

  const positionRef = useRef(position)
  const otherPositionRef = useRef<CharacterPosition>({ x: 50, y: 50 })
  const furnitureRef = useRef(furniture)
  const startCycleRef = useRef<() => void>(() => {})
  const lastInteractTimeRef = useRef<number>(0)
  const isBusyRef = useRef(false)
  const callbacksRef = useRef(callbacks)

  positionRef.current = position
  furnitureRef.current = furniture
  callbacksRef.current = callbacks

  function trackTimer<T extends ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>>(
    timer: T | null
  ): T | null {
    if (timer) {
      activeTimerCountRef.current++
      setActiveTimerCount(activeTimerCountRef.current)
    }
    return timer
  }

  function untrackTimer<T extends ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>>(
    timer: T | null
  ): void {
    if (timer) {
      activeTimerCountRef.current = Math.max(0, activeTimerCountRef.current - 1)
      setActiveTimerCount(activeTimerCountRef.current)
    }
  }

  function newRunId(): number {
    return ++runIdRef.current
  }

  function isValidRun(expectedId: number): boolean {
    return runIdRef.current === expectedId
  }

  function scheduleTimeout(cb: () => void, delay: number): ReturnType<typeof setTimeout> {
    const id = setTimeout(() => {
      untrackTimer(id)
      cb()
    }, delay)
    trackTimer(id)
    return id
  }

  const clearAllTimers = useCallback(() => {
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current)
      untrackTimer(moveTimerRef.current)
      moveTimerRef.current = null
    }
  }, [])

  const isBusy = useCallback(() => isBusyRef.current, [])

  const navigateToPosition = useCallback(
    (targetPos: CharacterPosition, onReach: () => void) => {
      clearAllTimers()
      const runId = newRunId()
      setShowBubble(false)
      setIsFurnitureInteraction(false)
      setIsWalking(true)
      isBusyRef.current = true

      moveTimerRef.current = trackTimer(
        setInterval(() => {
          if (!isValidRun(runId)) return

          setPosition((prev) => {
            const dx = targetPos.x - prev.x
            const dy = targetPos.y - prev.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < TARGET_REACH_THRESHOLD) {
              if (moveTimerRef.current && isValidRun(runId)) {
                clearInterval(moveTimerRef.current)
                untrackTimer(moveTimerRef.current)
                moveTimerRef.current = null
              }
              setIsWalking(false)

              scheduleTimeout(() => {
                if (!isValidRun(runId)) return
                onReach()
              }, 300)
              return prev
            }

            const step = Math.min(TARGET_STEP_SIZE, dist)
            const newX = prev.x + (dx / dist) * step
            const newY = prev.y + (dy / dist) * step

            if (isInBounds(newX, newY)) {
              return { x: newX, y: newY }
            }
            return prev
          })
        }, TARGET_MOVE_INTERVAL)
      )
    },
    [clearAllTimers]
  )

  const moveToTarget = useCallback(
    (targetPos: CharacterPosition, furniture: FurnitureItem, onReach: (f: FurnitureItem) => void) => {
      navigateToPosition(targetPos, () => onReach(furniture))
    },
    [navigateToPosition]
  )

  const resumeCycle = useCallback(() => {
    setShowBubble(false)
    setIsFurnitureInteraction(false)
    isBusyRef.current = false
    startCycleRef.current()
  }, [])

  const doNormalBubble = useCallback(() => {
    const runId = newRunId()
    const pos = positionRef.current
    const distToOther = distance(pos, otherPositionRef.current)

    if (distToOther < COUPLE_DISTANCE && Math.random() < 0.7) {
      const phrases = isBoy ? boyCouplePhrases : girlCouplePhrases
      setBubbleText(getRandomItem(phrases))
    } else {
      const phrases = isBoy ? boyPhrases : girlPhrases
      setBubbleText(getRandomItem(phrases))
    }
    setShowBubble(true)
    setIsFurnitureInteraction(false)
    isBusyRef.current = true

    scheduleTimeout(() => {
      if (!isValidRun(runId)) return
      resumeCycle()
    }, PAUSE_DURATION)
  }, [isBoy, resumeCycle])

  const doFurnitureInteraction = useCallback(
    (nearF: FurnitureItem, skipCooldown = false) => {
      const runId = newRunId()
      const phrase = getFurniturePhrase(nearF, isBoy)
      setBubbleText(phrase)
      setShowBubble(true)
      setIsFurnitureInteraction(true)
      isBusyRef.current = true
      if (!skipCooldown) {
        lastInteractTimeRef.current = Date.now()
      }

      scheduleTimeout(() => {
        if (!isValidRun(runId)) return
        resumeCycle()
      }, FURNITURE_INTERACT_DURATION)
    },
    [isBoy, resumeCycle]
  )

  const doCoupleInteraction = useCallback(
    (targetPos: CharacterPosition, phrase: string) => {
      clearAllTimers()
      navigateToPosition(targetPos, () => {
        const runId = newRunId()
        setBubbleText(phrase)
        setShowBubble(true)
        setIsFurnitureInteraction(true)
        isBusyRef.current = true
        lastInteractTimeRef.current = Date.now()

        scheduleTimeout(() => {
          if (!isValidRun(runId)) return
          resumeCycle()
        }, COUPLE_INTERACT_DURATION)
      })
    },
    [clearAllTimers, navigateToPosition, resumeCycle]
  )

  const doLocalWander = useCallback(() => {
    const runId = newRunId()
    const currentFurniture = furnitureRef.current

    moveTimerRef.current = trackTimer(
      setInterval(() => {
        if (!isValidRun(runId)) return

        setPosition((prev) => {
          const angles = [0, 45, 90, 135, 180, 225, 270, 315]
          const angle = getRandomItem(angles)
          const rad = (angle * Math.PI) / 180
          const newX = prev.x + Math.cos(rad) * STEP_SIZE
          const newY = prev.y + Math.sin(rad) * STEP_SIZE

          if (isInBounds(newX, newY)) {
            return { x: newX, y: newY }
          }
          return prev
        })
      }, MOVE_INTERVAL)
    )

    setIsWalking(true)
    setIsFurnitureInteraction(false)

    scheduleTimeout(() => {
      if (!isValidRun(runId)) return

      if (moveTimerRef.current) {
        clearInterval(moveTimerRef.current)
        untrackTimer(moveTimerRef.current)
        moveTimerRef.current = null
      }
      setIsWalking(false)

      const now = Date.now()
      const cooldownElapsed = now - lastInteractTimeRef.current > FURNITURE_INTERACT_COOLDOWN

      if (cooldownElapsed) {
        const nearF = findFurnitureNearby(positionRef.current, currentFurniture)
        if (nearF && Math.random() < FURNITURE_INTERACT_CHANCE) {
          const cb = callbacksRef.current?.onAutoFurnitureInteract
          if (cb && cb(nearF)) {
            return
          }
          doFurnitureInteraction(nearF)
          return
        }
      }

      doNormalBubble()
    }, LOCAL_WANDER_DURATION + Math.random() * 5000)
  }, [doFurnitureInteraction, doNormalBubble])

  const startRoomTour = useCallback(() => {
    const room = getRandomItem(ROOMS)
    const targetPos = randomPointInRoom(room)
    navigateToPosition(targetPos, doLocalWander)
  }, [navigateToPosition, doLocalWander])

  startCycleRef.current = startRoomTour

  useEffect(() => {
    const runId = newRunId()
    const initDelay = Math.random() * 2000
    const initTimer = trackTimer(
      setTimeout(() => {
        untrackTimer(initTimer)
        if (!isValidRun(runId)) return
        startRoomTour()
      }, initDelay)
    )

    return () => {
      if (initTimer) {
        clearTimeout(initTimer)
        untrackTimer(initTimer)
      }
      if (moveTimerRef.current) {
        clearInterval(moveTimerRef.current)
        untrackTimer(moveTimerRef.current)
      }
    }
  }, [startRoomTour])

  const setOtherPosition = useCallback((pos: CharacterPosition) => {
    otherPositionRef.current = pos
  }, [])

  return {
    position,
    showBubble,
    bubbleText,
    isWalking,
    isFurnitureInteraction,
    setOtherPosition,
    moveToTarget,
    doFurnitureInteraction,
    doCoupleInteraction,
    isBusy,
    activeTimerCount,
  }
}
