require "test_helper"

class SourceTest < ActiveSupport::TestCase
  test "Source::sanitize_path should sanitize a given path" do
    raw_path = " https://http://www.something.foo.site/bar//??bark=bite#but_what\nbar?baz=bam\n "
    sanitized_path = Source.sanitize_path(raw_path)
    assert_equal(sanitized_path, "something.foo.site/bar")
  end

  test "Source::sanitize_path should remove non-special subdomains wherever they occur" do
    raw_path = "www.en.m.wiki.h_www.www.h_m.m.foo.m.com/m.foo/www/h_www.html"
    sanitized_path = Source.sanitize_path(raw_path)
    assert_equal(sanitized_path, "en.wiki.h_www.h_m.foo.com/m.foo/www/h_www.html")
  end

  test "Source::sanitize_path should be idempotent" do
    raw_path = " https://http://www.something.foo.site/bar//??bark=bite#but_what\nbar?baz=bam\n "
    sanitized_path = Source.sanitize_path(raw_path)
    resanitized_path = Source.sanitize_path(sanitized_path)
    assert_equal(sanitized_path, resanitized_path)
  end

  test "path should be sanitized on create" do
    raw_path = " https://http://www.something.foo.site/bar//??bark=bite#but_what\nbar?baz=bam\n "
    sanitized_path = Source.sanitize_path(raw_path)

    assert_difference("Source.count", 1) do
      source = Source.create(path: raw_path, name: "Something Foo Site - Bar")
      assert_predicate(source, :valid?)
      assert_equal(source.path, sanitized_path)
    end
  end

  test "domain should be valid (contains at least one period)" do
    assert_difference("Source.count", 0) do
      source = Source.create(path: "https://something/bar", name: "Something Foo Site - Bar")
      refute_predicate(source.errors[:domain], :empty?)
    end
  end
end
