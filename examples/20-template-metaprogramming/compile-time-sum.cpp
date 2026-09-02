template <auto... Values>
struct sum {
    static constexpr auto value = (Values + ...);
};

int main() {
    static_assert(sum<1, 2, 3, 4, 5>::value == 15);
}
