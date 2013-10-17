# Add files and commands to this file, like the example:
#   watch(%r{file/path}) { `command(s)` }
#
guard 'shell' do
  watch(%r{sample/.+-spec\.js$}) {|m| `phantomjs phantomjs-jasmine.js sample/spec.html` }
  watch(%r{spec/.+-spec\.js$}) {|m| `phantomjs phantomjs-jasmine.js spec/spec.html` }
  watch(%r{jasmine-parameterize.js$}) {|m| `phantomjs phantomjs-jasmine.js spec/spec.html` }
end

