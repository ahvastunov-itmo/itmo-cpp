# Lecture 10  ООП. Полиморфизм.

> Источник: [Google Slides](https://docs.google.com/presentation/d/1odZGZdK0veFKQc_q1g36AeSxNxTLJsLeO34_si9WrkU/edit)

## Язык С++


- ООП. Полиморфизм

## Полиморфизм


- свойство системы, позволяющее использовать объекты с одинаковым интерфейсом без информации о типе и внутренней структуре объекта.

## Динамический полиморфизм


- Позднее и раннее связывание
- Виртуальные функции

## Виртуальные функции


```cpp
class ILogger {
   public:
    virtual void Log(const char* message) {}

    virtual ~ILogger() = default;
};

class CConsoleLogger : public ILogger {
   public:
```

- void Log(const char* message) override {
```cpp
std::cout << message << std::endl;
}
}
;
```

## Виртуальные функции


```cpp
class CFileLogger : public ILogger {
   public:
```

- CFileLogger(const char* filename)
- : stream_(filename)
```cpp
{
}

~CFileLogger() {
    stream_.close();
}

CFileLogger(const CFileLogger&) = delete;
CFileLogger& operator=(const CFileLogger&) = delete;
```

- void Log(const char* message) override {
```cpp
stream_ << message << std::endl;
}

private:
std::ofstream stream_;
}
```

## Таблица виртуальных функций


- Таблица заводится для любого класс с виртуальной функции
- Вызов виртуального метода — это вызов метода по адресу из таблицы
- Стандарт не определяет механизм реализации виртуальных функций, однако большинство компиляторов реализуют именно таблицу вирутальных функций

## Слайд 7

<!-- embedded-images:start -->
![Изображение 1 со слайда 7](assets/10-oop-polymorphism/slide-07-image-01.jpg)
<!-- embedded-images:end -->


## override


```cpp
class ILogger {
   public:
    virtual void Log(const char* message) {}

    virtual ~ILogger() = default;
};

class CConsoleLogger : public ILogger {
   public:
```

- void Log(const char* message) override {
```cpp
std::cout << message << std::endl;
}
}
;
```

## final


```cpp
class CConsoleLogger : public ILogger {
   public:
```

- void Log(const char* message) final {
```cpp
std::cout << message << std::endl;
}
}
;

class CModernConsoleLogger : public CConsoleLogger {
   public:
```

- void Log(const char* message) override {   // Compile-time error
```cpp
std::print("{0}", message);
}
}
;
```

## Virtual destructor


```cpp
class Base {
   public:
    Base() {
        std::cout << "Base\n";
    }
    virtual ~Base() {
        std::cout << "~Base\n";
    }
};

class Derrived : public Base {
   public:
    Derrived() {
        std::cout << "Derrived\n";
    }
    ~Derrived() {
        std::cout << "~Derrived\n";
    }
};

int main(int, char**) {
    Base* d = new Derrived;
    delete d;

    return 0;
}
```

## Абстрактный класс


```cpp
class ILogger {
   public:
    virtual void Log(const std::string& msg) = 0;  // pure virtual function
    virtual ~ILogger() = default;
};

int main(int, char**) {
```

- ILogger log;  // Error : variable type 'ILogger' is an abstract class
```cpp
return 0;
}
```

- класс экземпляр которого не может быть создан
- обычно используется в качестве базового класса
- содержит хотя бы 1 pure virtual function (чисто виртуальную функцию)

## Коллекции полиморфных объектов


## Non-Virtual Interface  Idiom


```cpp
class Base {
   public:
    void doWork() {
        preWork();
        doWorkImpl();
        postWork();
    }

   protected:
    virtual void doWorkImpl() = 0;

   private:
    void preWork() {
        cout << "Preparing...\n";
    }
    void postWork() {
        cout << "Cleaning up...\n";
    }
};

class Derived : public Base {
   protected:
```

- void doWorkImpl() override {
```cpp
cout << "Doing work in Derived\n";
}
}
;
```

## Virtual Friend Function Idiom


```cpp
class Base {
   public:
    virtual ~Base() = default;
    friend std::ostream& operator<<(std::ostream& stream, const Base& value);

   protected:
    virtual void printImpl(std::ostream& stream) const {
        stream << "Base\n";
    }
};

std::ostream& operator<<(std::ostream& stream, const Base& value) {
    value.printImpl(stream);
    return stream;
}
```

## Virtual Friend Function Idiom


```cpp
class Derrived : public Base {
   protected:
    void printImpl(std::ostream& stream) const override {
        stream << "Derrived\n";
    }
};
```

## Стоимость виртуальных функций


- Лишнее обращение к таблице вместо явного адреса
- Не возможно сделать inline optimization
- Для коллекций объектов - они всегда в куче
- Порядок объектов также может влиять на скорость

## ООП


- Абстракция
- Инкапсуляция
- Наследование
- Полиформизм

