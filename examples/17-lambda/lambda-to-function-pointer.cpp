int main() {
    auto is_greater_than_four = [](int value) { return value > 4; };
    bool (*function_pointer)(int) = is_greater_than_four;

    return function_pointer(5) ? 0 : 1;
}
