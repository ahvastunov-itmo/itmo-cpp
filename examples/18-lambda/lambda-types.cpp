#include <type_traits>

int main() {
    auto first = [](int value) { return value + 1; };
    auto second = [](int value) { return value + 1; };

    static_assert(!std::is_same_v<decltype(first), decltype(second)>);
}
