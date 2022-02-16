# #!/usr/bin/env bash

# set -e

# pnpm install

# # When `pnpm run ...` receives a SIGTERM it does not send it to child processes
# # (see https://github.com/pnpm/pnpm/issues/2653). This makes stopping the docker
# # process super slow (times out at 10s and sends a SIGKILL). So, we'll gather
# # all the child processes (see https://unix.stackexchange.com/a/124148) and kill
# # them ourselves when we receive a SIGTERM.
# list_descendants () {
#   local child_pids=$(ps -o pid= --ppid "$1")

#   for pid in $child_pids; do
#     list_descendants "$pid"
#   done

#   echo "$child_pids"
# }

# trap "echo 'dying from INT' && kill -INT $(list_descendants $$)" SIGINT
# trap "echo 'dying from TERM' && kill -TERM $(list_descendants $$)" SIGTERM
# trap "echo 'dying from EXIT' && kill $(list_descendants $$)" EXIT

# # From [this helpful article](https://vsupalov.com/docker-compose-stop-slow/#where-are-my-signals)
# # because stopping the running container is taking forever:
# #
# #   [...] Another possible cause, is if you run your process from an entrypoint
# #   script without using exec. With exec, your process “takes the place” and
# #   gets all signals, otherwise they are received and kept by the entrypoint
# #   script.
# #
# exec pnpm run serve --aggregate-output

echo "this script is just a gravestone... it's not here to be used."

exit 1

################################################################################
################################################################################

set -e

pnpm install

# When `pnpm run ...` receives a SIGTERM it does not send it to child processes
# (see https://github.com/pnpm/pnpm/issues/2653). This makes stopping the docker
# process super slow (times out at 10s and sends a SIGKILL). So, we'll gather
# all the child processes (see https://unix.stackexchange.com/a/124148) and kill
# them ourselves when we receive a SIGTERM.
list_descendants () {
  local child_pids=$(ps -o pid= --ppid "$1")

  for pid in $child_pids; do
    list_descendants "$pid"
  done

  echo "$child_pids"
}

cleanup () {
  echo "cleaning up..."
  local child_pids="$(list_descendants $$ | sed '/^$/d')"
  echo "$child_pids"
  kill -s $1 $child_pids
  exit $?
}

# cleanup () {
#   echo "cleaning up..."
#   pkill -$1 -P $$
# }

echo $$

# trap "echo 'heard USR2' && echo $$" SIGUSR2
# trap "echo 'dying from INT' && kill -INT $(list_descendants $$)" SIGINT
# trap "echo 'dying from TERM' && kill -TERM $(list_descendants $$)" SIGTERM
# trap "echo 'dying from EXIT' && kill $(list_descendants $$)" EXIT
# trap "echo 'dying from INT' && kill -INT '$(list_descendants $$)'" SIGINT
# trap "echo 'dying from TERM' && kill -TERM '$(list_descendants $$)' && exit $?" SIGTERM
# trap "echo 'dying from INT' && list_descendants $$ && exit $?" SIGINT
trap "echo 'dying from EXIT' && list_descendants $$ && exit $?" EXIT
# trap "echo 'dying from TERM' && cleanup SIGTERM" SIGTERM
trap "exit" SIGTERM

# while true; do
#   sleep 0.1
# done


# From [this helpful article](https://vsupalov.com/docker-compose-stop-slow/#where-are-my-signals)
# because stopping the running container is taking forever:
#
#   [...] Another possible cause, is if you run your process from an entrypoint
#   script without using exec. With exec, your process “takes the place” and
#   gets all signals, otherwise they are received and kept by the entrypoint
#   script.
#
# pnpm run serve --aggregate-output
# exec pnpm run serve --aggregate-output
exec pnpm exec vue-cli-service serve --aggregate-output
