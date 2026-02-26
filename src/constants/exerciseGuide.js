/**
 * 운동별 상세 가이드 데이터
 * - youtube: 공식 운동 방법 영상 (YouTube 검색 결과 기반 대표 영상)
 * - thumbnail: YouTube 썸네일 (자동 생성)
 * - equipment: 필요 기구
 * - muscles: 주요 자극 근육
 * - steps: 운동 방법 단계
 * - caution: 주의사항
 */
export const EXERCISE_GUIDE = {
  '스미스 머신 벤치프레스': {
    youtube: 'https://www.youtube.com/watch?v=xiNkdRMcbVA',
    thumbnail: 'https://img.youtube.com/vi/xiNkdRMcbVA/mqdefault.jpg',
    equipment: '스미스 머신, 벤치',
    muscles: '가슴(대흉근), 삼두근, 전면 삼각근',
    steps: [
      '벤치를 스미스 머신 바 아래에 놓고 눕습니다',
      '바를 어깨 너비보다 약간 넓게 잡습니다',
      '등과 엉덩이를 벤치에 밀착시킵니다',
      '바를 가슴 중앙까지 천천히 내립니다 (3초)',
      '가슴 근육을 조이며 폭발적으로 밀어올립니다'
    ],
    caution: '허리를 과도하게 아치형으로 만들지 마세요. 발은 바닥에 평평하게 놓으세요.'
  },
  '케이블 랫풀다운': {
    youtube: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    thumbnail: 'https://img.youtube.com/vi/CAwf7n6Luuc/mqdefault.jpg',
    equipment: '케이블 머신, 랫풀다운 바',
    muscles: '광배근, 이두근, 후면 삼각근',
    steps: [
      '시트에 앉아 무릎 패드로 허벅지를 고정합니다',
      '바를 어깨 너비보다 넓게 오버그립으로 잡습니다',
      '가슴을 내밀고 약간 뒤로 기울입니다',
      '팔꿈치를 아래·뒤로 당기며 바를 가슴 위까지 내립니다',
      '광배근을 수축하며 1초 유지 후 천천히 올립니다'
    ],
    caution: '반동을 사용하지 마세요. 목 뒤로 당기는 방식은 부상 위험이 있습니다.'
  },
  '덤벨 숄더프레스': {
    youtube: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    thumbnail: 'https://img.youtube.com/vi/qEwKCR5JCog/mqdefault.jpg',
    equipment: '덤벨, 벤치(등받이 있는)',
    muscles: '삼각근(전·중면), 삼두근',
    steps: [
      '등받이 벤치에 앉아 덤벨을 귀 옆 높이로 듭니다',
      '팔꿈치가 90도가 되도록 위치를 잡습니다',
      '코어를 긴장시키고 허리를 곧게 폅니다',
      '덤벨을 머리 위로 밀어올리되 완전히 잠그지 않습니다',
      '천천히 시작 위치로 내립니다'
    ],
    caution: '허리가 꺾이면 무게를 줄이세요. 목을 앞으로 내밀지 마세요.'
  },
  '케이블 크로스오버': {
    youtube: 'https://www.youtube.com/watch?v=taI4XduLpTk',
    thumbnail: 'https://img.youtube.com/vi/taI4XduLpTk/mqdefault.jpg',
    equipment: '케이블 머신 (양쪽)',
    muscles: '대흉근(중·하부), 전면 삼각근',
    steps: [
      '케이블을 높게 설정하고 양손에 핸들을 잡습니다',
      '한 발 앞으로 내밀어 안정적인 자세를 잡습니다',
      '팔꿈치를 약간 구부린 상태로 유지합니다',
      '양손을 아래·앞으로 모아 가슴 앞에서 교차시킵니다',
      '가슴 근육을 최대로 수축하며 1초 유지합니다'
    ],
    caution: '어깨가 앞으로 말리지 않도록 가슴을 내밀어 주세요.'
  },
  '덤벨 사이드 레터럴 레이즈': {
    youtube: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    thumbnail: 'https://img.youtube.com/vi/3VcKaXpzqRo/mqdefault.jpg',
    equipment: '덤벨',
    muscles: '삼각근(중면)',
    steps: [
      '덤벨을 양손에 들고 몸 옆에 위치시킵니다',
      '팔꿈치를 약간 구부린 상태를 유지합니다',
      '팔꿈치가 손목보다 약간 높도록 들어올립니다',
      '어깨 높이까지만 올리고 1초 유지합니다',
      '천천히 내립니다 (올릴 때보다 2배 느리게)'
    ],
    caution: '반동을 사용하거나 어깨를 으쓱하지 마세요. 무게보다 자세가 중요합니다.'
  },
  '바벨 벤치프레스': {
    youtube: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    thumbnail: 'https://img.youtube.com/vi/rT7DgCr-3pg/mqdefault.jpg',
    equipment: '바벨, 벤치, 랙',
    muscles: '대흉근, 삼두근, 전면 삼각근',
    steps: [
      '벤치에 누워 눈이 바 아래에 오도록 위치합니다',
      '어깨 너비보다 약간 넓게 오버그립으로 잡습니다',
      '어깨뼈를 모아 등을 살짝 아치형으로 만듭니다',
      '바를 가슴 중·하부까지 천천히 내립니다',
      '발로 바닥을 밀며 폭발적으로 밀어올립니다'
    ],
    caution: '반드시 스팟터를 세우거나 세이프티 바를 설정하세요. 엄지손가락으로 바를 감싸세요.'
  },
  '인클라인 덤벨 프레스': {
    youtube: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    thumbnail: 'https://img.youtube.com/vi/8iPEnn-ltC8/mqdefault.jpg',
    equipment: '덤벨, 인클라인 벤치(30~45도)',
    muscles: '대흉근(상부), 전면 삼각근, 삼두근',
    steps: [
      '벤치를 30~45도로 설정하고 앉습니다',
      '덤벨을 어깨 높이로 들고 눕습니다',
      '팔꿈치를 약 75도 각도로 벌립니다',
      '덤벨을 위로 밀어올리며 가볍게 모읍니다',
      '천천히 시작 위치로 내립니다'
    ],
    caution: '각도가 너무 높으면 어깨 부담이 커집니다. 30~45도를 유지하세요.'
  },
  '바벨 로우': {
    youtube: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ',
    thumbnail: 'https://img.youtube.com/vi/FWJR5Ve8bnQ/mqdefault.jpg',
    equipment: '바벨',
    muscles: '광배근, 승모근, 이두근, 후면 삼각근',
    steps: [
      '바벨을 어깨 너비로 잡고 허리를 45도로 기울입니다',
      '무릎을 약간 구부리고 등을 곧게 폅니다',
      '바벨을 배꼽 방향으로 당깁니다',
      '팔꿈치를 몸통 가까이 유지하며 등 근육을 수축합니다',
      '천천히 내리며 광배근을 스트레칭합니다'
    ],
    caution: '허리를 절대 굽히지 마세요. 무게보다 등의 자세가 최우선입니다.'
  },
  '밀리터리 프레스': {
    youtube: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
    thumbnail: 'https://img.youtube.com/vi/2yjwXTZQDDI/mqdefault.jpg',
    equipment: '바벨 또는 덤벨',
    muscles: '삼각근(전·중면), 삼두근, 상부 승모근',
    steps: [
      '바벨을 어깨 너비로 잡고 쇄골 앞에 위치시킵니다',
      '코어를 긴장시키고 발을 어깨 너비로 벌립니다',
      '바를 머리 위로 밀어올립니다',
      '머리를 약간 뒤로 빼서 바가 지나갈 공간을 만듭니다',
      '팔이 완전히 펴지면 머리를 다시 앞으로 가져옵니다'
    ],
    caution: '허리를 과도하게 젖히지 마세요. 코어를 항상 긴장 상태로 유지하세요.'
  },
  '딥스': {
    youtube: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    thumbnail: 'https://img.youtube.com/vi/2z8JmcrW-As/mqdefault.jpg',
    equipment: '딥스 바 (평행봉)',
    muscles: '대흉근(하부), 삼두근, 전면 삼각근',
    steps: [
      '평행봉에 양손을 짚고 팔을 펴서 몸을 들어올립니다',
      '몸을 약간 앞으로 기울여 가슴에 자극을 집중합니다',
      '팔꿈치를 구부리며 천천히 내려갑니다',
      '어깨가 팔꿈치 아래로 내려가면 올라옵니다',
      '팔을 완전히 펴지 않고 약간 구부린 상태에서 반복합니다'
    ],
    caution: '어깨 부상 위험이 있으니 너무 깊이 내려가지 마세요. 초보자는 어시스트 딥스 머신을 사용하세요.'
  },
  '풀업': {
    youtube: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    thumbnail: 'https://img.youtube.com/vi/eGo4IYlbE5g/mqdefault.jpg',
    equipment: '철봉',
    muscles: '광배근, 이두근, 후면 삼각근, 코어',
    steps: [
      '철봉을 어깨 너비보다 넓게 오버그립으로 잡습니다',
      '팔을 완전히 펴고 매달립니다 (데드행)',
      '어깨뼈를 아래로 당기며 시작합니다',
      '턱이 철봉 위로 올라올 때까지 당깁니다',
      '천천히 내려오며 광배근을 스트레칭합니다'
    ],
    caution: '반동 없이 순수 근력으로 당기세요. 처음에는 어시스트 밴드를 사용하세요.'
  },
  '페이스 풀': {
    youtube: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
    thumbnail: 'https://img.youtube.com/vi/rep-qVOkqgk/mqdefault.jpg',
    equipment: '케이블 머신, 로프 핸들',
    muscles: '후면 삼각근, 외회전근, 승모근(중부)',
    steps: [
      '케이블을 눈높이로 설정하고 로프를 잡습니다',
      '한 발 앞으로 내밀어 안정적인 자세를 잡습니다',
      '로프를 얼굴 쪽으로 당기며 팔꿈치를 높이 올립니다',
      '로프의 양 끝이 귀 옆에 오도록 당깁니다',
      '후면 삼각근을 수축하며 1초 유지 후 천천히 돌아갑니다'
    ],
    caution: '어깨 건강에 매우 중요한 운동입니다. 가벼운 무게로 정확한 자세를 익히세요.'
  },
  '레그 프레스': {
    youtube: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    thumbnail: 'https://img.youtube.com/vi/IZxyjW7MPJQ/mqdefault.jpg',
    equipment: '레그 프레스 머신',
    muscles: '대퇴사두근, 햄스트링, 둔근',
    steps: [
      '시트에 앉아 등과 엉덩이를 패드에 밀착시킵니다',
      '발을 어깨 너비로 플랫폼 중앙에 놓습니다',
      '안전 핀을 해제하고 무릎을 90도까지 구부립니다',
      '발꿈치로 밀어내며 다리를 폅니다 (완전히 잠그지 않음)',
      '천천히 내려오며 반복합니다'
    ],
    caution: '무릎이 발끝 안쪽으로 모이지 않도록 하세요. 허리가 패드에서 떨어지면 무게를 줄이세요.'
  },
  '레그 컬': {
    youtube: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
    thumbnail: 'https://img.youtube.com/vi/1Tq3QdYUuHs/mqdefault.jpg',
    equipment: '레그 컬 머신 (라잉 또는 시티드)',
    muscles: '햄스트링',
    steps: [
      '머신에 엎드려 발목 패드를 발목 위에 위치시킵니다',
      '허벅지를 패드에 밀착시킵니다',
      '발꿈치를 엉덩이 쪽으로 최대한 당깁니다',
      '햄스트링을 수축하며 1초 유지합니다',
      '천천히 내리며 완전히 펴줍니다'
    ],
    caution: '엉덩이가 들리면 무게가 너무 무거운 것입니다. 허리를 패드에 고정하세요.'
  },
  '카프 레이즈': {
    youtube: 'https://www.youtube.com/watch?v=-M4-G8p1fCI',
    thumbnail: 'https://img.youtube.com/vi/-M4-G8p1fCI/mqdefault.jpg',
    equipment: '카프 레이즈 머신 또는 계단',
    muscles: '비복근, 가자미근 (종아리)',
    steps: [
      '발 앞부분만 발판에 올리고 뒤꿈치는 공중에 둡니다',
      '무릎을 곧게 펴고 서 있습니다',
      '발꿈치를 최대한 높이 들어올립니다',
      '최상단에서 1~2초 유지하며 수축합니다',
      '발꿈치를 최대한 낮게 내려 스트레칭합니다'
    ],
    caution: '완전한 가동범위로 운동하세요. 반동 없이 천천히 올리고 내리세요.'
  },
  '레그 익스텐션': {
    youtube: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
    thumbnail: 'https://img.youtube.com/vi/YyvSfVjQeL0/mqdefault.jpg',
    equipment: '레그 익스텐션 머신',
    muscles: '대퇴사두근 (앞 허벅지)',
    steps: [
      '시트에 앉아 발목 패드를 발목 앞에 위치시킵니다',
      '등을 등받이에 밀착시킵니다',
      '다리를 완전히 펴며 대퇴사두근을 수축합니다',
      '최상단에서 1초 유지합니다',
      '천천히 내려 90도 이상 구부립니다'
    ],
    caution: '무릎 부상이 있는 경우 주의하세요. 무게보다 완전한 수축이 중요합니다.'
  },
  '바벨 백스쿼트': {
    youtube: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
    thumbnail: 'https://img.youtube.com/vi/ultWZbUMPL8/mqdefault.jpg',
    equipment: '바벨, 스쿼트 랙',
    muscles: '대퇴사두근, 햄스트링, 둔근, 코어',
    steps: [
      '바를 승모근 위(하이바) 또는 후면 삼각근(로우바)에 올립니다',
      '발을 어깨 너비로 벌리고 발끝을 약간 외회전합니다',
      '가슴을 내밀고 코어를 긴장시킵니다',
      '무릎이 발끝 방향으로 향하도록 앉습니다',
      '허벅지가 바닥과 평행하거나 더 깊이 앉습니다'
    ],
    caution: '무릎이 안쪽으로 모이지 않도록 하세요. 발꿈치가 들리면 발 간격을 넓히세요.'
  },
  '루마니안 데드리프트': {
    youtube: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
    thumbnail: 'https://img.youtube.com/vi/JCXUYuzwNrM/mqdefault.jpg',
    equipment: '바벨 또는 덤벨',
    muscles: '햄스트링, 둔근, 척추기립근',
    steps: [
      '바벨을 어깨 너비로 잡고 서 있습니다',
      '무릎을 약간 구부리고 고정합니다',
      '엉덩이를 뒤로 빼며 상체를 앞으로 기울입니다',
      '바벨이 정강이를 따라 내려갑니다',
      '햄스트링이 당기는 느낌이 날 때 멈추고 올라옵니다'
    ],
    caution: '등을 절대 굽히지 마세요. 바벨이 몸에서 멀어지지 않도록 하세요.'
  },
  '불가리안 스플릿 스쿼트': {
    youtube: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
    thumbnail: 'https://img.youtube.com/vi/2C-uNgKwPLE/mqdefault.jpg',
    equipment: '벤치, 덤벨 또는 바벨',
    muscles: '대퇴사두근, 둔근, 햄스트링',
    steps: [
      '벤치에서 약 60~90cm 앞에 섭니다',
      '한 발을 뒤로 뻗어 벤치 위에 올립니다',
      '앞발로 균형을 잡습니다',
      '앞 무릎이 90도가 될 때까지 내려갑니다',
      '앞발 뒤꿈치로 밀어 올라옵니다'
    ],
    caution: '앞 무릎이 발끝 앞으로 너무 나오지 않도록 하세요. 처음에는 체중만으로 연습하세요.'
  },
  '데드리프트': {
    youtube: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    thumbnail: 'https://img.youtube.com/vi/op9kVnSso6Q/mqdefault.jpg',
    equipment: '바벨',
    muscles: '햄스트링, 둔근, 광배근, 승모근, 척추기립근',
    steps: [
      '발을 어깨 너비로 벌리고 바벨 앞에 섭니다',
      '바벨이 정강이 중앙 위에 오도록 합니다',
      '허리를 곧게 펴고 가슴을 내밀며 바를 잡습니다',
      '바가 정강이를 스치듯 올라오게 당깁니다',
      '엉덩이를 앞으로 밀며 서 있는 자세로 완성합니다'
    ],
    caution: '허리를 절대 굽히지 마세요. 무거운 무게에서는 벨트 착용을 권장합니다.'
  },
  '고블렛 스쿼트': {
    youtube: 'https://www.youtube.com/watch?v=MeIiIdhvXT4',
    thumbnail: 'https://img.youtube.com/vi/MeIiIdhvXT4/mqdefault.jpg',
    equipment: '덤벨 또는 케틀벨',
    muscles: '대퇴사두근, 둔근, 코어',
    steps: [
      '덤벨을 양손으로 세로로 잡아 가슴 앞에 듭니다',
      '발을 어깨 너비보다 약간 넓게 벌립니다',
      '발끝을 약간 외회전합니다',
      '가슴을 내밀고 깊이 앉습니다',
      '팔꿈치가 무릎 안쪽을 밀어내며 자세를 유지합니다'
    ],
    caution: '스쿼트 자세 교정에 매우 좋은 운동입니다. 가능한 깊이 앉으세요.'
  },
  '덤벨 루마니안 데드리프트': {
    youtube: 'https://www.youtube.com/watch?v=hCDzSR6bW10',
    thumbnail: 'https://img.youtube.com/vi/hCDzSR6bW10/mqdefault.jpg',
    equipment: '덤벨',
    muscles: '햄스트링, 둔근, 척추기립근',
    steps: [
      '덤벨을 양손에 들고 허벅지 앞에 위치시킵니다',
      '무릎을 약간 구부리고 고정합니다',
      '엉덩이를 뒤로 빼며 덤벨을 정강이 따라 내립니다',
      '햄스트링이 당기는 느낌이 날 때 멈춥니다',
      '엉덩이를 앞으로 밀며 올라옵니다'
    ],
    caution: '등을 굽히지 마세요. 덤벨이 몸에서 멀어지지 않도록 유지하세요.'
  },
  '덤벨 오버헤드 프레스': {
    youtube: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    thumbnail: 'https://img.youtube.com/vi/qEwKCR5JCog/mqdefault.jpg',
    equipment: '덤벨',
    muscles: '삼각근, 삼두근, 상부 승모근',
    steps: [
      '덤벨을 귀 옆 높이로 들고 앉거나 섭니다',
      '팔꿈치가 90도가 되도록 합니다',
      '코어를 긴장시킵니다',
      '덤벨을 머리 위로 밀어올립니다',
      '천천히 시작 위치로 내립니다'
    ],
    caution: '허리를 꺾지 마세요. 코어를 항상 긴장 상태로 유지하세요.'
  },
  '덤벨 런지': {
    youtube: 'https://www.youtube.com/watch?v=D7KaRcUTQeE',
    thumbnail: 'https://img.youtube.com/vi/D7KaRcUTQeE/mqdefault.jpg',
    equipment: '덤벨',
    muscles: '대퇴사두근, 둔근, 햄스트링',
    steps: [
      '덤벨을 양손에 들고 똑바로 섭니다',
      '한 발을 앞으로 크게 내딛습니다',
      '앞 무릎이 90도가 될 때까지 내려갑니다',
      '뒷 무릎이 바닥에 닿기 직전에 멈춥니다',
      '앞발 뒤꿈치로 밀어 시작 자세로 돌아옵니다'
    ],
    caution: '앞 무릎이 발끝 앞으로 나오지 않도록 하세요. 상체를 곧게 유지하세요.'
  },
  '플랭크': {
    youtube: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    thumbnail: 'https://img.youtube.com/vi/pSHjTRCQxIw/mqdefault.jpg',
    equipment: '없음 (맨몸)',
    muscles: '코어(복직근, 복횡근), 어깨, 둔근',
    steps: [
      '팔꿈치를 어깨 아래에 놓고 엎드립니다',
      '발끝으로 몸을 들어올립니다',
      '머리부터 발끝까지 일직선을 만듭니다',
      '엉덩이가 올라가거나 내려가지 않도록 합니다',
      '코어를 최대한 긴장시키며 버팁니다'
    ],
    caution: '허리가 처지거나 엉덩이가 올라가면 자세가 무너진 것입니다. 시간보다 자세가 중요합니다.'
  },
  '마운틴 클라이머': {
    youtube: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    thumbnail: 'https://img.youtube.com/vi/nmwgirgXLYM/mqdefault.jpg',
    equipment: '없음 (맨몸)',
    muscles: '코어, 어깨, 대퇴사두근, 심폐지구력',
    steps: [
      '푸시업 자세로 시작합니다',
      '몸을 일직선으로 유지합니다',
      '한쪽 무릎을 가슴 쪽으로 빠르게 당깁니다',
      '반대쪽 다리로 교체합니다',
      '달리는 것처럼 빠르게 반복합니다'
    ],
    caution: '엉덩이가 올라가지 않도록 코어를 긴장시키세요. 손목이 아프면 주먹을 쥐고 하세요.'
  },
  '클린 앤 프레스': {
    youtube: 'https://www.youtube.com/watch?v=ol4gCMoMNxk',
    thumbnail: 'https://img.youtube.com/vi/ol4gCMoMNxk/mqdefault.jpg',
    equipment: '바벨 또는 덤벨',
    muscles: '전신 (하체, 코어, 어깨, 삼두)',
    steps: [
      '바벨을 어깨 너비로 잡고 데드리프트 자세를 취합니다',
      '폭발적으로 당겨 바벨을 어깨 높이로 올립니다 (클린)',
      '바벨을 받아 프런트 스쿼트 자세로 잡습니다',
      '바벨을 머리 위로 밀어올립니다 (프레스)',
      '천천히 내려 시작 자세로 돌아옵니다'
    ],
    caution: '복합 동작으로 부상 위험이 있습니다. 가벼운 무게로 충분히 연습 후 중량을 올리세요.'
  },
  '케이블 우드찹': {
    youtube: 'https://www.youtube.com/watch?v=pAplQXSNNwk',
    thumbnail: 'https://img.youtube.com/vi/pAplQXSNNwk/mqdefault.jpg',
    equipment: '케이블 머신',
    muscles: '복사근, 코어, 어깨, 둔근',
    steps: [
      '케이블을 높게 설정하고 옆으로 섭니다',
      '양손으로 핸들을 잡고 팔을 폅니다',
      '대각선 아래 방향으로 회전하며 당깁니다',
      '코어를 비틀며 반대쪽 무릎 방향으로 내립니다',
      '천천히 시작 위치로 돌아옵니다'
    ],
    caution: '허리가 아닌 코어의 회전으로 동작하세요. 무릎과 발은 정면을 향하게 유지하세요.'
  },
  '힙 어브덕션': {
    youtube: 'https://www.youtube.com/watch?v=kDqklk2LKSY',
    thumbnail: 'https://img.youtube.com/vi/kDqklk2LKSY/mqdefault.jpg',
    equipment: '힙 어브덕션 머신',
    muscles: '중둔근, 소둔근 (엉덩이 옆)',
    steps: [
      '머신에 앉아 무릎 패드를 무릎 바깥쪽에 위치시킵니다',
      '등을 등받이에 밀착시킵니다',
      '다리를 천천히 바깥쪽으로 벌립니다',
      '최대 가동범위에서 1초 유지합니다',
      '천천히 모아 시작 위치로 돌아옵니다'
    ],
    caution: '반동을 사용하지 마세요. 천천히 조이는 느낌으로 운동하세요.'
  },
  '힙 어덕션': {
    youtube: 'https://www.youtube.com/watch?v=kDqklk2LKSY',
    thumbnail: 'https://img.youtube.com/vi/kDqklk2LKSY/mqdefault.jpg',
    equipment: '힙 어덕션 머신',
    muscles: '내전근 (허벅지 안쪽)',
    steps: [
      '머신에 앉아 무릎 패드를 무릎 안쪽에 위치시킵니다',
      '다리를 벌린 시작 자세를 취합니다',
      '다리를 천천히 안쪽으로 모읍니다',
      '최대 수축 지점에서 1초 유지합니다',
      '천천히 벌려 시작 위치로 돌아옵니다'
    ],
    caution: '내전근 부상 예방을 위해 스트레칭을 충분히 하세요.'
  },
  '글루트 브릿지': {
    youtube: 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E',
    thumbnail: 'https://img.youtube.com/vi/OUgsJ8-Vi0E/mqdefault.jpg',
    equipment: '없음 또는 바벨',
    muscles: '둔근, 햄스트링, 코어',
    steps: [
      '등을 바닥에 대고 눕습니다',
      '무릎을 구부리고 발을 엉덩이 너비로 놓습니다',
      '발꿈치로 바닥을 밀며 엉덩이를 들어올립니다',
      '어깨-엉덩이-무릎이 일직선이 되도록 합니다',
      '엉덩이를 최대로 수축하며 2초 유지합니다'
    ],
    caution: '허리가 아닌 둔근으로 올리세요. 발이 너무 멀거나 가까우면 자극이 분산됩니다.'
  },
  '시티드 카프 레이즈': {
    youtube: 'https://www.youtube.com/watch?v=-M4-G8p1fCI',
    thumbnail: 'https://img.youtube.com/vi/-M4-G8p1fCI/mqdefault.jpg',
    equipment: '시티드 카프 레이즈 머신 또는 덤벨+벤치',
    muscles: '가자미근 (종아리 깊은 근육)',
    steps: [
      '머신에 앉아 무릎 패드를 허벅지 위에 올립니다',
      '발 앞부분만 발판에 올립니다',
      '발꿈치를 최대한 높이 들어올립니다',
      '최상단에서 1~2초 유지합니다',
      '발꿈치를 최대한 낮게 내려 스트레칭합니다'
    ],
    caution: '앉아서 하는 카프 레이즈는 가자미근에 집중됩니다. 완전한 가동범위로 운동하세요.'
  },
  '케이블 바이셉 컬': {
    youtube: 'https://www.youtube.com/watch?v=NFzTWp2qpiE',
    thumbnail: 'https://img.youtube.com/vi/NFzTWp2qpiE/mqdefault.jpg',
    equipment: '케이블 머신, 스트레이트 바 또는 EZ 바',
    muscles: '이두근, 상완근',
    steps: [
      '케이블을 낮게 설정하고 바를 잡습니다',
      '팔꿈치를 몸통 옆에 고정합니다',
      '팔꿈치를 구부리며 바를 어깨 높이로 올립니다',
      '이두근을 최대로 수축하며 1초 유지합니다',
      '천천히 내리며 완전히 폅니다'
    ],
    caution: '팔꿈치가 앞으로 나오거나 몸이 흔들리면 무게를 줄이세요.'
  },
  '케이블 트라이셉 푸시다운': {
    youtube: 'https://www.youtube.com/watch?v=2-LAMcpzODU',
    thumbnail: 'https://img.youtube.com/vi/2-LAMcpzODU/mqdefault.jpg',
    equipment: '케이블 머신, 로프 또는 바 핸들',
    muscles: '삼두근',
    steps: [
      '케이블을 높게 설정하고 핸들을 잡습니다',
      '팔꿈치를 몸통 옆에 고정합니다',
      '팔꿈치만 구부리며 핸들을 아래로 밀어냅니다',
      '팔이 완전히 펴질 때 삼두근을 수축합니다',
      '천천히 올려 시작 위치로 돌아옵니다'
    ],
    caution: '팔꿈치가 몸통에서 떨어지지 않도록 하세요. 상체를 앞으로 기울이지 마세요.'
  },
  '핵 스쿼트': {
    youtube: 'https://www.youtube.com/watch?v=EdtPADyPDQo',
    thumbnail: 'https://img.youtube.com/vi/EdtPADyPDQo/mqdefault.jpg',
    equipment: '핵 스쿼트 머신',
    muscles: '대퇴사두근, 둔근, 햄스트링',
    steps: [
      '머신에 등을 대고 어깨 패드를 맞춥니다',
      '발을 플랫폼 중앙에 어깨 너비로 놓습니다',
      '안전 핸들을 풀고 무릎을 구부려 내려갑니다',
      '허벅지가 바닥과 평행하거나 더 깊이 앉습니다',
      '발꿈치로 밀어 올라옵니다'
    ],
    caution: '무릎이 안쪽으로 모이지 않도록 하세요. 발 위치로 자극 부위를 조절할 수 있습니다.'
  },
  '펜들레이 로우': {
    youtube: 'https://www.youtube.com/watch?v=Weu9HMHdiDA',
    thumbnail: 'https://img.youtube.com/vi/Weu9HMHdiDA/mqdefault.jpg',
    equipment: '바벨',
    muscles: '광배근, 승모근, 이두근, 후면 삼각근',
    steps: [
      '바벨을 바닥에 놓고 어깨 너비로 잡습니다',
      '상체를 바닥과 평행하게 기울입니다',
      '폭발적으로 바벨을 배꼽 방향으로 당깁니다',
      '바벨이 가슴에 닿으면 1초 유지합니다',
      '바벨을 완전히 바닥에 내려놓습니다'
    ],
    caution: '일반 바벨 로우보다 폭발적인 동작입니다. 허리를 곧게 유지하세요.'
  },
  '바벨 컬': {
    youtube: 'https://www.youtube.com/watch?v=kwG2ipFRgfo',
    thumbnail: 'https://img.youtube.com/vi/kwG2ipFRgfo/mqdefault.jpg',
    equipment: '바벨 또는 EZ 바',
    muscles: '이두근, 상완근, 전완근',
    steps: [
      '바벨을 어깨 너비로 언더그립으로 잡습니다',
      '팔꿈치를 몸통 옆에 고정합니다',
      '바벨을 어깨 높이까지 올립니다',
      '이두근을 최대로 수축하며 1초 유지합니다',
      '천천히 내리며 완전히 폅니다'
    ],
    caution: '치팅(반동)을 사용하지 마세요. 팔꿈치가 앞으로 나오면 무게를 줄이세요.'
  },
  '버피': {
    youtube: 'https://www.youtube.com/watch?v=dZgVxmf6jkA',
    thumbnail: 'https://img.youtube.com/vi/dZgVxmf6jkA/mqdefault.jpg',
    equipment: '없음 (맨몸)',
    muscles: '전신 (가슴, 어깨, 코어, 하체, 심폐)',
    steps: [
      '서 있는 자세에서 시작합니다',
      '쪼그려 앉으며 손을 바닥에 짚습니다',
      '발을 뒤로 뻗어 푸시업 자세를 만듭니다',
      '푸시업을 1회 합니다 (선택)',
      '발을 앞으로 당겨 점프하며 손을 머리 위로 올립니다'
    ],
    caution: '착지 시 무릎을 부드럽게 구부려 충격을 흡수하세요. 처음에는 점프 없이 연습하세요.'
  },
  '케틀벨 스윙': {
    youtube: 'https://www.youtube.com/watch?v=sSESeQAir2M',
    thumbnail: 'https://img.youtube.com/vi/sSESeQAir2M/mqdefault.jpg',
    equipment: '케틀벨',
    muscles: '둔근, 햄스트링, 코어, 어깨, 심폐',
    steps: [
      '케틀벨을 양손으로 잡고 발 사이에 놓습니다',
      '힙 힌지 자세로 케틀벨을 뒤로 스윙합니다',
      '엉덩이를 폭발적으로 앞으로 밀어 케틀벨을 올립니다',
      '케틀벨이 어깨 높이까지 올라옵니다',
      '케틀벨이 내려오며 자연스럽게 힙 힌지로 이어집니다'
    ],
    caution: '팔이 아닌 엉덩이 힘으로 스윙하세요. 허리를 굽히지 마세요.'
  },
  '바벨 클린': {
    youtube: 'https://www.youtube.com/watch?v=EKRiW9Yt3Ps',
    thumbnail: 'https://img.youtube.com/vi/EKRiW9Yt3Ps/mqdefault.jpg',
    equipment: '바벨',
    muscles: '전신 (하체, 코어, 등, 어깨)',
    steps: [
      '바벨을 어깨 너비로 잡고 데드리프트 자세를 취합니다',
      '무릎을 펴며 바벨을 허벅지 높이로 당깁니다',
      '발꿈치를 들며 폭발적으로 당겨올립니다',
      '팔꿈치를 앞으로 회전하며 바벨을 받습니다',
      '프런트 랙 자세로 완성합니다'
    ],
    caution: '올림픽 리프팅 기술입니다. 코치의 지도 하에 배우는 것을 권장합니다.'
  },
  '스쿼트 점프': {
    youtube: 'https://www.youtube.com/watch?v=CVaEhXotL7M',
    thumbnail: 'https://img.youtube.com/vi/CVaEhXotL7M/mqdefault.jpg',
    equipment: '없음 (맨몸)',
    muscles: '대퇴사두근, 둔근, 종아리, 심폐',
    steps: [
      '발을 어깨 너비로 벌리고 섭니다',
      '스쿼트 자세로 앉습니다',
      '폭발적으로 점프합니다',
      '공중에서 팔을 위로 뻗습니다',
      '착지 시 무릎을 부드럽게 구부려 충격을 흡수합니다'
    ],
    caution: '착지 시 무릎이 안쪽으로 모이지 않도록 하세요. 딱딱한 바닥보다 매트 위에서 하세요.'
  },
  '클로즈 그립 벤치프레스': {
    youtube: 'https://www.youtube.com/watch?v=nEF0bv2FW94',
    thumbnail: 'https://img.youtube.com/vi/nEF0bv2FW94/mqdefault.jpg',
    equipment: '바벨, 벤치, 랙',
    muscles: '삼두근, 대흉근(내측), 전면 삼각근',
    steps: [
      '벤치에 누워 바벨을 어깨 너비보다 좁게 잡습니다',
      '팔꿈치를 몸통 가까이 유지합니다',
      '바벨을 가슴 아래쪽으로 내립니다',
      '삼두근으로 밀어올립니다',
      '팔꿈치가 벌어지지 않도록 주의합니다'
    ],
    caution: '너무 좁게 잡으면 손목에 부담이 됩니다. 어깨 너비 정도가 적당합니다.'
  }
}
