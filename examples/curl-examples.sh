#!/bin/bash

# LeakJar API cURL Examples
# This script demonstrates how to use the LeakJar API with cURL commands

API_BASE_URL="http://localhost:3000/api/v1"
API_KEY="lj_live_UodzH0gWpmkhUtYRdEr1HEsTwMPaIy1C"  # Your API key

echo "LeakJar API cURL Examples"
echo "=========================="

# Function to make API request
make_request() {
    local endpoint="$1"
    local params="$2"

    if [ -n "$params" ]; then
        curl -s -H "Authorization: Bearer $API_KEY" \
             -H "Content-Type: application/json" \
             "$API_BASE_URL$endpoint?$params" | jq .
    else
        curl -s -H "Authorization: Bearer $API_KEY" \
             -H "Content-Type: application/json" \
             "$API_BASE_URL$endpoint" | jq .
    fi
}

echo -e "\n=== Example 1: Basic Domain Query ==="
echo "Getting first 10 records for example.com"
make_request "/leaked-data" "domain=example.com&limit=10"

echo -e "\n=== Example 2: Date Range Query ==="
echo "Getting email records from 2024"
make_request "/leaked-data" "domain=example.com&date_from=2024-01-01&date_to=2024-12-31&type=email&limit=5"

echo -e "\n=== Example 3: Username Only Query ==="
echo "Getting records with usernames only"
make_request "/leaked-data" "domain=example.com&type=username&limit=5"

echo -e "\n=== Example 4: Pagination Example ==="
echo "Getting records with offset (records 10-19)"
make_request "/leaked-data" "domain=example.com&limit=10&offset=10"

echo -e "\n=== Example 5: Get Verified Domains ==="
echo "Getting domains accessible via API"
make_request "/domains"

echo -e "\n=== Example 6: Get All Domains Status ==="
echo "Getting all domains with verification status"
make_request "/domains/all"

echo -e "\n=== Example 7: API Usage Statistics ==="
echo "Getting current API usage"
make_request "/usage"

echo -e "\n=== Example 8: Error Handling Example ==="
echo "Making request without domain parameter (should fail)"
curl -s -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json" \
     "$API_BASE_URL/leaked-data" | jq .

echo -e "\n=== Example 9: Invalid API Key Example ==="
echo "Making request with invalid API key (should fail)"
curl -s -H "Authorization: Bearer invalid_key_123" \
     -H "Content-Type: application/json" \
     "$API_BASE_URL/leaked-data?domain=example.com&limit=5" | jq .

echo -e "\n=== Example 10: Export to JSON file ==="
echo "Exporting data to JSON file"
OUTPUT_FILE="leaked_data_export.json"
curl -s -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json" \
     "$API_BASE_URL/leaked-data?domain=example.com&limit=50" > "$OUTPUT_FILE"

echo "Data exported to $OUTPUT_FILE"
echo "File size: $(wc -c < "$OUTPUT_FILE") bytes"
echo "Record count: $(jq '.data | length' "$OUTPUT_FILE" 2>/dev/null || echo "0")"

echo -e "\n=== Example 11: Real-time Monitoring Example ==="
echo "Monitoring for new records (will run for 3 iterations)"
for i in {1..3}; do
    echo -e "\n--- Check $i ---"
    make_request "/usage"
    sleep 2
done

echo -e "\n=== All cURL Examples Completed ==="

echo -e "\n=== Quick Reference ==="
echo "# Basic query (domain must be verified):"
echo "curl -H \"Authorization: Bearer YOUR_API_KEY\" \\"
echo "     \"$API_BASE_URL/leaked-data?domain=example.com&limit=10\""
echo ""
echo "# Check verified domains first:"
echo "curl -H \"Authorization: Bearer YOUR_API_KEY\" \\"
echo "     \"$API_BASE_URL/domains\""
echo ""
echo "# Check all domains status (verified + pending):"
echo "curl -H \"Authorization: Bearer YOUR_API_KEY\" \\"
echo "     \"$API_BASE_URL/domains/all\""
echo ""
echo "# With date filter:"
echo "curl -H \"Authorization: Bearer YOUR_API_KEY\" \\"
echo "     \"$API_BASE_URL/leaked-data?domain=example.com&date_from=2024-01-01&limit=10\""
echo ""
echo "# Usage stats:"
echo "curl -H \"Authorization: Bearer YOUR_API_KEY\" \\"
echo "     \"$API_BASE_URL/usage\""