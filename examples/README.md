# LeakJar API Examples

이 디렉토리에는 LeakJar API를 사용하는 방법을 보여주는 다양한 예제 코드들이 포함되어 있습니다.

## 🔑 API 인증

모든 API 요청은 유효한 API 키가 필요합니다:

```bash
Authorization: Bearer lj_live_UodzH0gWpmkhUtYRdEr1HEsTwMPaIy1C
```

## 📚 예제 파일

### 1. JavaScript/Node.js 클라이언트 (`api-client.js`)

Node.js 환경에서 LeakJar API를 사용하는 완전한 클라이언트 예제입니다.

**주요 기능:**
- 자동 인증 및 오류 처리
- 페이지네이션 지원
- 날짜 범위 필터링
- 데이터 타입 필터링 (email, username, password)
- 사용량 통계 조회

**실행 방법:**
```bash
# Node.js가 설치되어 있어야 합니다
node api-client.js
```

**클래스 사용 예시:**
```javascript
const { LeakJarClient } = require('./api-client');

const client = new LeakJarClient('your_api_key_here');

// 도메인별 데이터 조회
const result = await client.getLeakedData({
  domain: 'example.com',
  limit: 100,
  dateFrom: '2024-01-01',
  type: 'email'
});

// 전체 데이터 가져오기 (자동 페이지네이션)
const allData = await client.getAllLeakedData('example.com');
```

### 2. Python 클라이언트 (`api-client.py`)

Python에서 LeakJar API를 사용하는 예제입니다.

**주요 기능:**
- requests 라이브러리 사용
- 자동 재시도 및 오류 처리
- CSV로 데이터 내보내기
- 스트리밍 데이터 처리

**실행 방법:**
```bash
# Python 3.6+와 requests 라이브러리 필요
pip install requests
python api-client.py
```

**클래스 사용 예시:**
```python
from api_client import LeakJarClient

client = LeakJarClient('your_api_key_here')

# 기본 조회
result = client.get_leaked_data(
    domain='example.com',
    limit=50,
    date_from='2024-01-01'
)

# 대용량 데이터 처리
for record in client.get_all_leaked_data('example.com'):
    print(record['email'])
```

### 3. cURL 예제 (`curl-examples.sh`)

cURL을 사용한 API 호출 예제 스크립트입니다.

**실행 방법:**
```bash
# jq 설치 필요 (JSON 포맷팅용)
# macOS: brew install jq
# Ubuntu: sudo apt-get install jq

chmod +x curl-examples.sh
./curl-examples.sh
```

**기본 cURL 명령어:**
```bash
# 기본 도메인 조회
curl -H "Authorization: Bearer your_api_key" \
     "http://localhost:3000/api/v1/leaked-data?domain=example.com&limit=10"

# 날짜 필터링
curl -H "Authorization: Bearer your_api_key" \
     "http://localhost:3000/api/v1/leaked-data?domain=example.com&date_from=2024-01-01&date_to=2024-12-31"

# 사용량 확인
curl -H "Authorization: Bearer your_api_key" \
     "http://localhost:3000/api/v1/usage"
```

## 🌐 API 엔드포인트

### GET /api/v1/domains

사용자가 API로 접근할 수 있는 verified 도메인 목록을 조회합니다.

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "domain": "example.com",
      "type": "URL",
      "verified_at": "2024-01-15T10:30:00Z",
      "api_accessible": true
    }
  ],
  "meta": {
    "total_domains": 1,
    "response_time_ms": 45
  },
  "note": "Only verified domains are accessible via API."
}
```

### GET /api/v1/domains/all

사용자가 등록한 모든 도메인과 인증 상태를 조회합니다. verified 여부와 상관없이 모든 도메인 정보를 보여줍니다.

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "domain": "example.com",
      "type": "URL",
      "monitoring_enabled": true,
      "company_name": "Example Corp",
      "is_verified": true,
      "verified_at": "2024-01-15T10:30:00Z",
      "visibility": "organization",
      "ownership_type": "direct",
      "access_level": "owner",
      "api_accessible": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "stats": {
    "total": 1,
    "verified": 1,
    "pending": 0,
    "monitoring_enabled": 1,
    "api_accessible": 1,
    "by_type": {
      "URL": 1,
      "EMAIL": 0
    },
    "by_ownership": {
      "direct": 1,
      "organization": 0
    }
  },
  "help": {
    "verification_info": "Domains must be verified by administrators before API access is granted.",
    "contact_support": "Contact your administrator to verify pending domains."
  }
}
```

### GET /api/v1/leaked-data

유출 데이터를 조회하는 메인 엔드포인트입니다. **반드시 verified된 도메인만 접근 가능합니다.**

**쿼리 파라미터:**
- `domain` (필수): 조회할 도메인 (반드시 verified된 도메인이어야 함)
- `limit` (선택): 반환할 레코드 수 (기본값: 100, 최대: 1000)
- `offset` (선택): 건너뛸 레코드 수 (기본값: 0)
- `date_from` (선택): 시작 날짜 (YYYY-MM-DD 형식)
- `date_to` (선택): 종료 날짜 (YYYY-MM-DD 형식)
- `type` (선택): 데이터 타입 필터 (`email`, `username`, `password`)

**🚨 중요:** 도메인은 반드시 관리자가 verified해야만 API 접근이 가능합니다.

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": "12345",
      "email": "us***e@example.com",
      "username": "testuser",
      "password": "********",
      "domain": "example.com",
      "source": "breach_source",
      "date_collected": "2024-01-15",
      "has_password": true,
      "data_type": "web"
    }
  ],
  "pagination": {
    "total": 1500,
    "limit": 100,
    "offset": 0,
    "has_more": true
  },
  "meta": {
    "response_time_ms": 245,
    "api_key_id": "lj_live_U***",
    "user_id": "user_***"
  }
}
```

### GET /api/v1/usage

API 사용량 통계를 조회합니다.

**응답 예시:**
```json
{
  "success": true,
  "requests_today": 156,
  "requests_month": 3420,
  "rate_limit_per_minute": 1000,
  "daily_usage": [
    {"date": "2024-01-15", "count": 156},
    {"date": "2024-01-14", "count": 234}
  ]
}
```

## 📊 데이터 분석 예제

### 1. 도메인별 유출 통계

```python
# Python 예제
import requests
from collections import Counter

def analyze_domain_breaches(domain):
    response = requests.get(
        f"http://localhost:3000/api/v1/leaked-data",
        params={"domain": domain, "limit": 1000},
        headers={"Authorization": f"Bearer {API_KEY}"}
    )

    data = response.json()
    if data['success']:
        # 이메일 도메인 분석
        email_domains = Counter()
        for record in data['data']:
            if record['email']:
                email_domain = record['email'].split('@')[1]
                email_domains[email_domain] += 1

        print(f"Top email domains for {domain}:")
        for domain, count in email_domains.most_common(10):
            print(f"  {domain}: {count}")

analyze_domain_breaches('example.com')
```

### 2. 시간별 유출 트렌드

```javascript
// JavaScript 예제
async function analyzeBreachTrends(domain) {
  const client = new LeakJarClient(API_KEY);
  const data = await client.getAllLeakedData(domain, {
    dateFrom: '2024-01-01',
    limit: 50
  });

  // 월별 그룹화
  const monthlyData = {};
  data.forEach(record => {
    const month = record.date_collected.substring(0, 7); // YYYY-MM
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });

  console.log('Monthly breach trends:');
  Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([month, count]) => {
      console.log(`${month}: ${count} records`);
    });
}
```

## ⚠️ 보안 주의사항

1. **API 키 보호**: API 키를 코드에 하드코딩하지 마세요. 환경 변수를 사용하세요.
2. **HTTPS 사용**: 프로덕션에서는 항상 HTTPS를 사용하세요.
3. **이메일 마스킹**: API는 이메일을 마스킹하여 반환합니다 (`us***e@example.com`)
4. **비밀번호**: 비밀번호는 항상 `********`로 마스킹됩니다.
5. **레이트 리밋**: 분당 최대 1000 요청으로 제한됩니다.

## 🚀 성능 최적화 팁

1. **페이지네이션 사용**: 대용량 데이터는 작은 청크로 나누어 요청하세요
2. **날짜 필터링**: 필요한 기간의 데이터만 요청하세요
3. **타입 필터링`: 필요한 데이터 타입만 요청하세요
4. **캐싱**: 반복 조회하는 데이터는 캐시하세요

## 🛠️ 개발 환경 설정

1. LeakJar 서버가 `localhost:3000`에서 실행 중인지 확인
2. 유효한 API 키를 발급받아 환경 변수에 설정
3. 필요한 의존성 설치:
   - Node.js: `npm install`
   - Python: `pip install requests`

## 📞 지원

API 사용 중 문제가 발생하면:
1. 서버 로그 확인
2. API 키 유효성 검사
3. 요청 파라미터 확인
4. 레이트 리밋 확인