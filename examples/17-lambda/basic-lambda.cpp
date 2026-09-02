int main() {
    auto is_greater_than_four = [](int value) { return value > 4; };

    return is_greater_than_four(5) ? 0 : 1;
}
