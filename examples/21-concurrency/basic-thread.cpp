#include <iostream>
#include <thread>

int main() {
    std::thread worker{[] { std::cout << "Hello from " << std::this_thread::get_id() << '\n'; }};
    worker.join();

    return 0;
}
