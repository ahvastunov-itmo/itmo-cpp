#include <functional>
#include <iostream>
#include <thread>
#include <vector>

int main() {
    std::vector<std::thread> workers;

    for (int worker_index = 0; worker_index < 8; ++worker_index) {
        workers.emplace_back([worker_index] {
            int local_value = 0;
            std::cout << "Worker " << worker_index << ", thread " << std::this_thread::get_id()
                      << ", local address " << static_cast<void*>(std::addressof(local_value))
                      << '\n';
        });
    }

    for (std::thread& worker : workers) {
        worker.join();
    }

    return 0;
}
