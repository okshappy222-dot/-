'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, Navigation, Clock, Star, ExternalLink, Loader2 } from 'lucide-react'

const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || ''

/**
 * Kakao Maps SDK를 동적으로 로드하는 훅
 */
function useKakaoMap (containerId, coords) {
  const mapRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!coords || !KAKAO_APP_KEY) return

    const loadMap = () => {
      const container = document.getElementById(containerId)
      if (!container || !window.kakao) return

      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(coords.lat, coords.lng),
          level: 4
        }
        mapRef.current = new window.kakao.maps.Map(container, options)
        setIsLoaded(true)
      })
    }

    if (window.kakao) {
      loadMap()
      return
    }

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services&autoload=false`
    script.onload = loadMap
    document.head.appendChild(script)
  }, [containerId, coords])

  return { mapRef, isLoaded }
}

/**
 * 카카오 키워드 검색으로 헬스장 목록 조회
 */
function searchGyms (keyword, coords, callback) {
  if (!window.kakao || !window.kakao.maps) {
    callback([])
    return
  }
  const ps = new window.kakao.maps.services.Places()
  ps.keywordSearch(
    `${keyword} 헬스장`,
    (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        callback(data.slice(0, 8))
      } else {
        callback([])
      }
    },
    {
      location: coords ? new window.kakao.maps.LatLng(coords.lat, coords.lng) : undefined,
      radius: 3000,
      sort: window.kakao.maps.services.SortBy.DISTANCE
    }
  )
}

function GymCard ({ gym, index }) {
  const distance = gym.distance ? `${(gym.distance / 1000).toFixed(1)}km` : null

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all"
      style={{ background: 'var(--bg-3)', border: '1px solid var(--border)' }}
      whileHover={{ borderColor: 'rgba(223,255,0,0.3)', background: 'rgba(223,255,0,0.03)' }}
      onClick={() => window.open(`https://map.kakao.com/link/map/${gym.id}`, '_blank')}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
        style={{ background: 'rgba(223,255,0,0.1)', color: 'var(--volt)' }}>
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-bold text-sm truncate">{gym.place_name}</h4>
          <ExternalLink size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        </div>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
          {gym.road_address_name || gym.address_name}
        </p>
        <div className="flex items-center gap-3 mt-2">
          {distance && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--volt)' }}>
              <Navigation size={11} />
              {distance}
            </span>
          )}
          {gym.phone && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{gym.phone}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function GymFinder () {
  const [query, setQuery] = useState('')
  const [gyms, setGyms] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [coords, setCoords] = useState(null)
  const [locationStatus, setLocationStatus] = useState('idle')
  const [hasSearched, setHasSearched] = useState(false)

  const handleGeoLocation = () => {
    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationStatus('success')
      },
      () => setLocationStatus('error'),
      { timeout: 8000 }
    )
  }

  const handleSearch = () => {
    if (!query.trim()) return
    setIsSearching(true)
    setHasSearched(true)

    if (!KAKAO_APP_KEY || !window.kakao) {
      // API 키 없을 때 목업 데이터 표시
      setTimeout(() => {
        setGyms([
          { id: '1', place_name: `${query} 피트니스센터`, road_address_name: `${query}구 헬스로 123`, distance: '350', phone: '02-1234-5678' },
          { id: '2', place_name: `${query} 스포츠클럽`, road_address_name: `${query}구 운동길 456`, distance: '720', phone: '02-9876-5432' },
          { id: '3', place_name: `${query} GX 헬스장`, road_address_name: `${query}구 체력로 789`, distance: '1200', phone: '02-5555-1234' },
          { id: '4', place_name: `${query} 크로스핏`, road_address_name: `${query}구 근육대로 101`, distance: '1800', phone: '02-7777-8888' }
        ])
        setIsSearching(false)
      }, 800)
      return
    }

    searchGyms(query, coords, (results) => {
      setGyms(results)
      setIsSearching(false)
    })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <MapPin size={18} style={{ color: 'var(--volt)' }} />
        <h3 className="text-xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          내 주변 헬스장
        </h3>
      </div>

      {/* 검색 바 */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="지역명 입력 (예: 강남, 홍대, 수원)"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'var(--bg-3)',
                border: '1.5px solid var(--border)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--volt)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSearch}
            disabled={isSearching}
            className="px-5 py-3 rounded-xl font-bold text-sm cursor-pointer flex items-center gap-2"
            style={{ background: 'var(--volt)', color: '#000', border: 'none' }}
          >
            {isSearching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            검색
          </motion.button>
        </div>

        {/* 현재 위치 버튼 */}
        <button
          onClick={handleGeoLocation}
          disabled={locationStatus === 'loading'}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer w-fit"
          style={{
            background: locationStatus === 'success' ? 'rgba(223,255,0,0.1)' : 'var(--bg-3)',
            border: `1px solid ${locationStatus === 'success' ? 'var(--volt)' : 'var(--border)'}`,
            color: locationStatus === 'success' ? 'var(--volt)' : 'var(--text-secondary)'
          }}
        >
          {locationStatus === 'loading'
            ? <Loader2 size={14} className="animate-spin" />
            : <Navigation size={14} />
          }
          {locationStatus === 'success' ? '위치 확인됨 ✓' : locationStatus === 'error' ? '위치 접근 실패' : '현재 위치 사용'}
        </button>
      </div>

      {/* 결과 */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-10 gap-3"
          >
            <Loader2 size={20} className="animate-spin" style={{ color: 'var(--volt)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>헬스장 검색 중...</span>
          </motion.div>
        )}

        {!isSearching && hasSearched && gyms.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
            style={{ color: 'var(--text-muted)' }}
          >
            검색 결과가 없어요. 다른 지역명으로 검색해보세요.
          </motion.div>
        )}

        {!isSearching && gyms.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-3"
          >
            <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              {gyms.length}개 헬스장 발견 · 클릭하면 카카오맵으로 이동해요
            </div>
            {gyms.map((gym, i) => (
              <GymCard key={gym.id} gym={gym} index={i} />
            ))}
          </motion.div>
        )}

        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 gap-3"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(223,255,0,0.08)', border: '1px solid var(--border-volt)' }}>
              <MapPin size={28} style={{ color: 'var(--volt)' }} />
            </div>
            <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
              지역명을 입력하거나 현재 위치를 사용해<br />주변 헬스장을 찾아보세요
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
