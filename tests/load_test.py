import asyncio
import time
import httpx
import os
import sys

TARGET_URL = os.getenv("LOAD_TEST_URL", "http://localhost:8000/")
CONCURRENCY = 100
DURATION = int(os.getenv("LOAD_TEST_DURATION", "60")) # seconds

results = []
stop_event = asyncio.Event()

async def worker(client, worker_id):
    while not stop_event.is_set():
        start_time = time.perf_counter()
        try:
            response = await client.get(TARGET_URL, timeout=10.0)
            elapsed = (time.perf_counter() - start_time) * 1000.0 # ms
            status = response.status_code
            results.append((elapsed, status, True))
        except Exception as e:
            elapsed = (time.perf_counter() - start_time) * 1000.0 # ms
            results.append((elapsed, 0, False))

async def main():
    print(f"============================================================")
    print(f" SCANTRACE BASELINE/LOAD TESTING")
    print(f"============================================================")
    print(f"Target URL:        {TARGET_URL}")
    print(f"Concurrency:       {CONCURRENCY} virtual users")
    print(f"Duration:          {DURATION} seconds")
    print(f"Starting load test...")
    print(f"============================================================")
    
    start_test_time = time.time()
    
    # Configure connection pool for high concurrency
    limits = httpx.Limits(max_keepalive_connections=CONCURRENCY, max_connections=CONCURRENCY * 2)
    async with httpx.AsyncClient(limits=limits) as client:
        # Spawn workers
        tasks = [asyncio.create_task(worker(client, i)) for i in range(CONCURRENCY)]
        
        # Wait for duration
        await asyncio.sleep(DURATION)
        stop_event.set()
        
        # Gather all workers
        await asyncio.gather(*tasks, return_exceptions=True)

    end_test_time = time.time()
    actual_duration = end_test_time - start_test_time
    
    # Analyze results
    success_latencies = [r[0] for r in results if r[2] and r[1] == 200]
    total_requests = len(results)
    successful_requests = len(success_latencies)
    failed_requests = total_requests - successful_requests
    
    rps = total_requests / actual_duration
    
    if success_latencies:
        avg_time = sum(success_latencies) / len(success_latencies)
        min_time = min(success_latencies)
        max_time = max(success_latencies)
    else:
        avg_time = min_time = max_time = 0.0
        
    print(f"TEST RESULTS SUMMARY:")
    print(f"------------------------------------------------------------")
    print(f"Total Duration:         {actual_duration:.2f} seconds")
    print(f"Total Requests Sent:    {total_requests}")
    print(f"Successful Requests:    {successful_requests} ({(successful_requests/total_requests)*100:.2f}%)")
    print(f"Failed Requests:        {failed_requests} ({(failed_requests/total_requests)*100:.2f}%)")
    print(f"Requests per Second:    {rps:.2f} RPS")
    print(f"------------------------------------------------------------")
    print(f"Response Times (for successful requests):")
    print(f"Average:                {avg_time:.2f} ms")
    print(f"Min:                    {min_time:.2f} ms")
    print(f"Max:                    {max_time:.2f} ms")
    print(f"============================================================")
    # Save results to json
    results_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "Test Results"))
    os.makedirs(results_dir, exist_ok=True)
    load_results_json = os.path.join(results_dir, "load_results.json")
    
    status_str = "Passed"
    error_str = ""
    if failed_requests > total_requests * 0.05:
        status_str = "Failed"
        error_str = f"High failure rate: {failed_requests} failed requests out of {total_requests}"

    load_data = {
        "name": "Test 15: Baseline/Load Testing",
        "status": status_str,
        "duration_ms": actual_duration * 1000.0,
        "error": error_str,
        "type": "Load (httpx)",
        "metrics": {
            "total_requests": total_requests,
            "successful_requests": successful_requests,
            "failed_requests": failed_requests,
            "rps": round(rps, 2),
            "avg_ms": round(avg_time, 2),
            "min_ms": round(min_time, 2),
            "max_ms": round(max_time, 2)
        }
    }
    
    with open(load_results_json, "w") as f:
        import json
        json.dump(load_data, f, indent=4)
        
    print(f"Stored load test results to {load_results_json}")

    # Check if there's any failure
    if failed_requests > total_requests * 0.05:
        print("Warning: More than 5% of requests failed.")
        sys.exit(1)
    else:
        print("Load testing passed successfully! [TESTED]")
        sys.exit(0)

if __name__ == "__main__":
    asyncio.run(main())
