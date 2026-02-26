'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Search, Navigation, ExternalLink, Loader2 } from 'lucide-react'

const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || ''

function useKakaoMap (containerId, coords) {
  const mapRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!coords || !KAKAO_APP_KEY) return
    const loadMap = () => {
      const container = document.getElementById(containerId)
      if (!container || !window.kakao) return
      window.kakao.maps.load(() => {
        const options = { center: new window.kakao.maps.LatLng(coords.lat, coords.lng), level: 4 }
        mapRef.current = new window.kakao.maps.Map(container, options)
        setIsLoaded(true)
      })
    }
    if (window.kakao) { loadMap(); return }
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services&autoload=false`
    script.onload = loadMap
    document.head.appendChild(script)
  }, [containerId, coords])

  return { mapRef, isLoaded }
}

function searchGyms (keyword, coords, callback) {
  if (!window.kakao || !window.kakao.maps) { callback([]); return }
  const ps = new window.kakao.maps.services.Places()
  ps.keywordSearch(
    `${keyword} 헬스장`,
    (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) callback(data.slice(0, 8))
      else callback([])
    },
    { location: coords ? new window.kakao.maps.LatLng(coords.lat, coords.lng) : undefined, radius: 3000, sort: window.kakao.maps.services.SortBy.DISTANCE }
  )
}

function GymCard ({ gym, index }) {
  const distance = gym.distance ? `${(gym.distance / 1000).toFixed(1)}km` : null
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex items-start gap-4 p-5 cursor-pointer transition-all"
      style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
      whileHover={{ borderColor: 'var(--volt-border)' }}
      onClick={() => window.open(`https://map.kakao.com/link/map/${gym.id}`, '_blank')}
    >
      <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center font-bold text-xs"
        style={{ background: 'var(--volt-soft)', color: 'var(--volt)', borderRadius: 'var(--radius)' }}>
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-bold text-sm truncate">{gym.place_name}</h4>
          <ExternalLink size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        </div>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
          {gym.road_address_name || gym.address_name}
        </p>
        <div className="flex items-center gap-3 mt-2">
          {distance && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--volt)' }}>
              <Navigation size={10} /> {distance}
            </span>
          )}
          {gym.phone && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{gym.phone}</span>}
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
      (pos) => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocationStatus('success') },
      () => setLocationStatus('error'),
      { timeout: 8000 }
    )
  }

  const handleSearch = () => {
    if (!query.trim()) return
    setIsSearching(true)
    setHasSearched(true)
    if (!KAKAO_APP_KEY || !window.kakao) {
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
    searchGyms(query, coords, (results) => { setGyms(results); setIsSearching(false) })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <MapPin size={16} style={{ color: 'var(--volt)' }} />
        <h3 className="text-xl font-black uppercase tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Nearby Gyms
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="지역명 (예: 강남, 홍대)"
              className="w-full pl-10 pr-4 py-3 text-sm outline-none"
              style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: '#fff', fontFamily: 'inherit' }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--volt-border)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            disabled={isSearching}
            className="px-5 py-3 font-bold text-xs cursor-pointer flex items-center gap-2 uppercase tracking-wider"
            style={{ background: 'var(--volt)', color: '#000', border: 'none', borderRadius: 'var(--radius)' }}
          >
            {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Search
          </motion.button>
        </div>

        <button
          onClick={handleGeoLocation}
          disabled={locationStatus === 'loading'}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium cursor-pointer w-fit"
          style={{
            background: locationStatus === 'success' ? 'var(--volt-soft)' : 'transparent',
            border: `1px solid ${locationStatus === 'success' ? 'var(--volt-border)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)',
            color: locationStatus === 'success' ? 'var(--volt)' : 'var(--text-muted)',
          }}
        >
          {locationStatus === 'loading' ? <Loader2 size={13} className="animate-spin" /> : <Navigation size={13} />}
          {locationStatus === 'success' ? 'Located ✓' : locationStatus === 'error' ? 'Failed' : 'Use Location'}
        </button>
      </div>

      <AnimatePresence>
        {isSearching && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-12 gap-3">
            <Loader2 size={18} className="animate-spin" style={{ color: 'var(--volt)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>검색 중...</span>
          </motion.div>
        )}

        {!isSearching && hasSearched && gyms.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            검색 결과 없음
          </motion.div>
        )}

        {!isSearching && gyms.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              {gyms.length} results
            </div>
            {gyms.map((gym, i) => <GymCard key={gym.id} gym={gym} index={i} />)}
          </motion.div>
        )}

        {!hasSearched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-14 h-14 flex items-center justify-center"
              style={{ background: 'var(--volt-soft)', border: '1px solid var(--volt-border)', borderRadius: 'var(--radius-md)' }}>
              <MapPin size={24} style={{ color: 'var(--volt)' }} />
            </div>
            <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
              지역명을 입력하거나 현재 위치를 사용하세요
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
