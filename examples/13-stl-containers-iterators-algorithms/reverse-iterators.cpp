#include <algorithm>
#include <iostream>
#include <list>

int main() {
    int values[] = {12, 3, 25, 7, 11, 213, 7, 123, 29, -3};
    std::reverse(std::begin(values), std::end(values));

    std::list<int> numbers(std::begin(values), std::end(values));
    std::reverse(numbers.begin(), numbers.end());

    for (int number : numbers) {
        std::cout << number << ' ';
    }
    std::cout << '\n';

    return 0;
}
