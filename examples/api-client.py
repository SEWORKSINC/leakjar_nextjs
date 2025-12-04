"""
LeakJar API Client Example (Python)
This example demonstrates how to use the LeakJar API to retrieve leaked data
"""

import requests
import json
import time
from typing import Dict, List, Optional, Any
from urllib.parse import urljoin

class LeakJarClient:
    """
    Python client for the LeakJar API
    """

    def __init__(self, api_key: str, base_url: str = "http://localhost:3000/api/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })

    def _request(self, endpoint: str, **kwargs) -> Dict[str, Any]:
        """
        Make authenticated API request
        """
        url = urljoin(self.base_url, endpoint)

        try:
            response = self.session.get(url, **kwargs)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            if e.response:
                try:
                    error_data = e.response.json()
                    raise Exception(f"API Error: {error_data.get('error', e.response.statusText)}")
                except json.JSONDecodeError:
                    raise Exception(f"API Error: {e.response.status_code} {e.response.reason}")
            raise

    def get_leaked_data(
        self,
        domain: str,
        limit: int = 100,
        offset: int = 0,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
        data_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get leaked data by domain

        Args:
            domain: Domain to search (required)
            limit: Number of records to return (default: 100, max: 1000)
            offset: Number of records to skip (default: 0)
            date_from: Start date filter (YYYY-MM-DD format)
            date_to: End date filter (YYYY-MM-DD format)
            data_type: Data type filter ('email', 'username', 'password')

        Returns:
            API response with leaked data
        """
        if not domain:
            raise ValueError("Domain parameter is required")

        params = {
            'domain': domain,
            'limit': min(limit, 1000),  # Enforce maximum limit
            'offset': offset
        }

        if date_from:
            params['date_from'] = date_from
        if date_to:
            params['date_to'] = date_to
        if data_type:
            params['type'] = data_type

        return self._request('/leaked-data', params=params)

    def get_all_leaked_data(
        self,
        domain: str,
        limit_per_request: int = 100,
        max_records: Optional[int] = None,
        **kwargs
    ) -> List[Dict[str, Any]]:
        """
        Get all leaked data for a domain with automatic pagination

        Args:
            domain: Domain to search
            limit_per_request: Number of records per request (default: 100)
            max_records: Maximum total records to fetch (optional)
            **kwargs: Additional parameters for get_leaked_data

        Returns:
            List of all leaked data records
        """
        all_data = []
        offset = 0

        print(f"Fetching all leaked data for domain: {domain}")

        while True:
            print(f"Fetching records {offset} to {offset + limit_per_request - 1}...")

            result = self.get_leaked_data(
                domain=domain,
                limit=limit_per_request,
                offset=offset,
                **kwargs
            )

            if result.get('success') and result.get('data'):
                records = result['data']
                all_data.extend(records)

                # Check if we should stop
                if not result['pagination']['has_more']:
                    break

                if max_records and len(all_data) >= max_records:
                    all_data = all_data[:max_records]
                    break

                offset += limit_per_request

                # Add delay to avoid rate limiting
                time.sleep(0.1)
            else:
                break

        print(f"Total records fetched: {len(all_data)}")
        return all_data

    def get_usage(self) -> Dict[str, Any]:
        """
        Get API usage statistics
        """
        return self._request('/usage')

    def get_verified_domains(self) -> Dict[str, Any]:
        """
        Get user's verified domains for API access
        """
        return self._request('/domains')

    def get_all_domains(self) -> Dict[str, Any]:
        """
        Get all user's domains with verification status
        """
        return self._request('/domains/all')

    def check_domain_access(self, domain: str) -> Dict[str, Any]:
        """
        Check if domain is accessible before making data request
        """
        try:
            domains_result = self.get_verified_domains()
            if domains_result.get('success'):
                accessible_domains = [d['domain'] for d in domains_result.get('data', [])]
                domain_info = next((d for d in domains_result.get('data', []) if d['domain'] == domain), None)
                return {
                    'accessible': domain in accessible_domains,
                    'accessible_domains': accessible_domains,
                    'domain_info': domain_info
                }
            return {'accessible': False, 'accessible_domains': []}
        except Exception as e:
            print(f"Failed to check domain access: {e}")
            return {'accessible': False, 'accessible_domains': []}


def example_1_basic_query():
    """Example 1: Basic domain query"""
    print("\n=== Example 1: Basic Domain Query ===")

    client = LeakJarClient(API_KEY)

    try:
        result = client.get_leaked_data(
            domain='example.com',
            limit=10
        )

        print("API Response:", json.dumps(result, indent=2))

        if result.get('success'):
            print(f"\nFound {len(result['data'])} records")
            print(f"Total available: {result['pagination']['total']}")

            # Display first few records
            for i, record in enumerate(result['data']):
                print(f"\nRecord {i + 1}:")
                print(f"  Email: {record.get('email')}")
                print(f"  Username: {record.get('username')}")
                print(f"  Has Password: {record.get('has_password')}")
                print(f"  Domain: {record.get('domain')}")
                print(f"  Date: {record.get('date_collected')}")
    except Exception as e:
        print(f"Example 1 failed: {e}")


def example_2_date_range_query():
    """Example 2: Date range query"""
    print("\n=== Example 2: Date Range Query ===")

    client = LeakJarClient(API_KEY)

    try:
        result = client.get_leaked_data(
            domain='example.com',
            date_from='2024-01-01',
            date_to='2024-12-31',
            data_type='email',  # Only get records with emails
            limit=20
        )

        print(f"Found {len(result['data'])} email records in date range")

        for record in result['data']:
            print(f"{record.get('email')} - {record.get('date_collected')}")
    except Exception as e:
        print(f"Example 2 failed: {e}")


def example_3_paginated_fetch():
    """Example 3: Paginated fetch"""
    print("\n=== Example 3: Paginated Fetch ===")

    client = LeakJarClient(API_KEY)

    try:
        # Get all data with automatic pagination
        all_data = client.get_all_leaked_data(
            domain='example.com',
            date_from='2024-01-01',
            limit_per_request=50,  # Fetch 50 records at a time
            max_records=200  # Limit to 200 total records for example
        )

        print(f"Successfully fetched {len(all_data)} total records")

        # Analyze the data
        emails = len([r for r in all_data if r.get('email')])
        usernames = len([r for r in all_data if r.get('username')])
        passwords = len([r for r in all_data if r.get('has_password')])

        print(f"\nData Analysis:")
        print(f"  Records with emails: {emails}")
        print(f"  Records with usernames: {usernames}")
        print(f"  Records with passwords: {passwords}")

        # Save to CSV file
        import csv
        if all_data:
            with open('leaked_data_example.csv', 'w', newline='', encoding='utf-8') as csvfile:
                if all_data:
                    fieldnames = ['email', 'username', 'domain', 'date_collected', 'has_password']
                    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                    writer.writeheader()

                    for record in all_data:
                        writer.writerow({
                            'email': record.get('email'),
                            'username': record.get('username'),
                            'domain': record.get('domain'),
                            'date_collected': record.get('date_collected'),
                            'has_password': record.get('has_password')
                        })
            print(f"\nData saved to 'leaked_data_example.csv'")
    except Exception as e:
        print(f"Example 3 failed: {e}")


def example_4_all_domains_status():
    """Example 4: All domains status"""
    print("\n=== Example 4: All Domains Status ===")

    client = LeakJarClient(API_KEY)

    try:
        result = client.get_all_domains()

        print("All Your Domains (with verification status):")
        print("==============================================")

        if result.get('success') and result.get('data'):
            stats = result['stats']
            print(f"\n📊 Domain Statistics:")
            print(f"  Total domains: {stats['total']}")
            print(f"  Verified: {stats['verified']} ✅")
            print(f"  Pending verification: {stats['pending']} ⏳")
            print(f"  Monitoring enabled: {stats['monitoring_enabled']}")
            print(f"  API accessible: {stats['api_accessible']} 🔑")

            print(f"\n📂 By Type:")
            print(f"  URL domains: {stats['by_type']['URL']}")
            print(f"  Email domains: {stats['by_type']['EMAIL']}")

            print(f"\n👥 By Ownership:")
            print(f"  Direct: {stats['by_ownership']['direct']}")
            print(f"  Organization: {stats['by_ownership']['organization']}")

            print("\n📋 Domain Details:")
            for i, domain in enumerate(result['data'], 1):
                print(f"\n{i}. {domain['domain']}")
                print(f"   Type: {domain['type']}")
                print(f"   Status: {'✅ Verified' if domain['is_verified'] else '⏳ Pending'}")
                print(f"   Monitoring: {'🟢 Enabled' if domain['monitoring_enabled'] else '🔴 Disabled'}")
                print(f"   API Access: {'🔑 Available' if domain['api_accessible'] else '🚫 Not Available'}")
                print(f"   Ownership: {domain['ownership_type']} ({domain['access_level']})")
                print(f"   Created: {domain['created_at'][:10]}")

                if domain.get('verified_at'):
                    print(f"   Verified: {domain['verified_at'][:10]}")

                if domain.get('company_name'):
                    print(f"   Company: {domain['company_name']}")

            print(f"\n💡 Help: {result['help']['verification_info']}")
            if stats['pending'] > 0:
                print(f"\n⚠️  You have {stats['pending']} domain(s) pending verification.")
                print(f"   {result['help']['contact_support']}")
        else:
            print("❌ No domains found")
            print("Register domains at http://localhost:3000/settings/domains")
    except Exception as e:
        print(f"Example 4 failed: {e}")


def example_5_usage_stats():
    """Example 5: API usage statistics"""
    print("\n=== Example 5: API Usage Statistics ===")

    client = LeakJarClient(API_KEY)

    try:
        usage = client.get_usage()

        print("API Usage:")
        print(f"  Requests today: {usage.get('requests_today', 0)}")
        print(f"  Requests this month: {usage.get('requests_month', 0)}")
        print(f"  Rate limit per minute: {usage.get('rate_limit_per_minute', 0)}")

        if usage.get('daily_usage'):
            print("\nDaily Usage (last 7 days):")
            for day in usage['daily_usage']:
                print(f"  {day.get('date')}: {day.get('count', 0)} requests")
    except Exception as e:
        print(f"Example 5 failed: {e}")


def example_5_streaming_example():
    """Example 5: Streaming data processing"""
    print("\n=== Example 5: Streaming Data Processing ===")

    client = LeakJarClient(API_KEY)

    try:
        # Process data in batches to avoid memory issues
        domain = 'example.com'
        batch_size = 50
        offset = 0

        total_processed = 0

        while True:
            result = client.get_leaked_data(
                domain=domain,
                limit=batch_size,
                offset=offset
            )

            if not result.get('success') or not result.get('data'):
                break

            records = result['data']
            if not records:
                break

            # Process this batch
            print(f"Processing batch of {len(records)} records...")

            for record in records:
                # Example processing: extract domains from emails
                email = record.get('email')
                if email and '@' in email:
                    email_domain = email.split('@')[1]
                    print(f"Found email from domain: {email_domain}")

                total_processed += 1

            # Check if there are more records
            if not result['pagination']['has_more']:
                break

            offset += batch_size

        print(f"Total records processed: {total_processed}")
    except Exception as e:
        print(f"Example 5 failed: {e}")


# Configuration
API_KEY = "lj_live_UodzH0gWpmkhUtYRdEr1HEsTwMPaIy1C"  # Your API key


def run_examples():
    """Run all examples"""
    print("LeakJar API Client Examples (Python)")
    print("====================================")

    example_1_basic_query()
    example_2_date_range_query()
    example_3_paginated_fetch()
    example_4_all_domains_status()
    example_5_usage_stats()
    example_6_streaming_example()

    print("\n=== All Examples Completed ===")


def example_6_streaming_example():
    """Example 6: Streaming data processing"""
    print("\n=== Example 6: Streaming Data Processing ===")

    client = LeakJarClient(API_KEY)

    try:
        # Process data in batches to avoid memory issues
        domain = 'example.com'
        batch_size = 50
        offset = 0

        total_processed = 0

        while True:
            result = client.get_leaked_data(
                domain=domain,
                limit=batch_size,
                offset=offset
            )

            if not result.get('success') or not result.get('data'):
                break

            records = result['data']
            if not records:
                break

            # Process this batch
            print(f"Processing batch of {len(records)} records...")

            for record in records:
                # Example processing: extract domains from emails
                email = record.get('email')
                if email and '@' in email:
                    email_domain = email.split('@')[1]
                    print(f"Found email from domain: {email_domain}")

                total_processed += 1

            # Check if there are more records
            if not result['pagination']['has_more']:
                break

            offset += batch_size

        print(f"Total records processed: {total_processed}")
    except Exception as e:
        print(f"Example 6 failed: {e}")


if __name__ == "__main__":
    run_examples()