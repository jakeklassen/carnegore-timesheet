# Carnegie May 2019 Work Log

###### tags: `vehikl` `carnegie` `worklog`

## Fri May 21 2019

[IOTP-2296]:
- Addressed feedback and back in review
- Ran into a super annoying issue that we could not figure out. It ended up being a yarn.lock issue, remove and re-add `prom-client` to fix.

[IOTP-2295]:
- Continued work on tests

## Thu May 30 2019

[IOTP-2295]:
- Working on tests

## Wed May 29 2019

[IOTP-2296]:
- In Review

[IOTP-2295]:
- Started, made some good progress

## Tue May 28 2019

[IOTP-2296]:
- Fixed issue with my own stupidity misusing a routing key
- Tested are good
- Need to merge ServicesCommon fix in the AM

We should add support to `CassandraRepo` for `DELETE FROM ... WHERE`

## Mon May 27 2019

[IOTP-2296]:
- Finished a bunch of functionality but was blocked hard on testing
  - First fix was to the default location logic, it was never await in sensorium data service

## Fri May 24 2019

[IOTP-2296]:
- Starting

## Thu May 23 2019

- Carnegie tech summit in Waterloo

## Wed May 22 2019

- Sprint planning + summit prep

## Tue May 21 2019

- Sick

## Mon May 20 2019

- Holiday

## Fri May 17 2019

[IOTP-2267]:
- Merged

[IOTP-2217]:
- Peer feedback, review and testing

## Thu May 16 2019

[IOTP-2267]:
- Continuing work

## Wed May 15 2019

[IOTP-2267]:
- Started

[IOTP-2465]:
- Merged

[IOTP-2217]:
- Helping Blake

[IOTP-2475]
- Merged
- Bug with `deserializeFromDbAsType` instanceof check against wrong class

## Tue May 14 2019

[IOTP-2355]:
- Merged

[IOTP-2397]:
- In review
- Merged

[IOTP-2373]:
- Had to fix functional tests broken by

[IOTP-2217]
- Wrote a functional test to ensure this is correct

[IOTP-2465]:
- Started

## Mon May 13 2019

[IOTP-1320]:
- Started into this but noticed that [IOTP-27] seemed to address all this

[IOTP-2397]:
- Started

Nice alias to avoid pip installing `cqlsh`:

```
alias cqlsh='docker run -it --net=host -v `pwd`:`pwd` -w `pwd` --rm cassandra cqlsh'
```

## Fri May 10 2019

- Internal Carnegie sync up call with Chris, Mavrick
- Team retro

[IOTP-2355]:
- Continuing work
- Merged

Routing key: `ct.iot.device.common.*.event.#`

RabbitMQ message to test with:

```json=
{
  "deviceId": "2e5b2b73-5ba0-4126-b88c-4cf4b8f59329",
  "deviceProfileId": "204d3e27-2256-4c37-b075-869a96faac06",
  "eventType":  "http://carnegietechnologies.com/iot/device/common/event/measurement.json",
  "time": "2012-05-19T16:36:42.259Z",
  "seqId": 2049956962,
  "eventData": {
    "buttonEvents": [
      {"buttonPress":"single-click","remainingLife":29.66}
    ]
  }
}
```

## Thu May 09 2019

- Tech interview with Italo: 2-3pm

[IOTP-2355]:
- Starting looking into this
- Spun my wheels with a stupid local docker-compose setup, on k8s now

[IOTP-2392]:
- In review, merged

## Wed May 08 2019

- Sprint planning
- Mobbing
- Italo pre-interview meeting with Mavrick

[IOTP-2392]:
- Continuing work
- Stuck on nested Entity subclass not deserializing properly

## Tue May 07 2019

- Vacation

## Mon May 06 2019

- Vacation

## Fri May 03 2019

[IOTP-2392]:
- Pushed initial PR

[IOTP-2334]:
- Merged

[IOTP-2217]:
- Debugged Blake's tests and found issue
- Filed [IOTP-2392]

## Thu May 02 2019

[IOTP-2334]:
- Back in progress to address feedback
  - The way battery calculations are handled is not common between the message types. Reilly sent me https://carnegietechnologies.app.box.com/file/309374069791 to help

[IOTP-2354]:
- Pulled into sprint

## Wed May 01 2019

[IOTP-2217]:
- Fixed Blakes tests
- Recommended he run functional tests

[IOTP-2334]:
- Made some tweaks and in review

[IOTP-2334]: https://jira.carnegietechnologies.com/browse/IOTP-2334
[IOTP-2217]: https://jira.carnegietechnologies.com/browse/IOTP-2217
[IOTP-2354]: https://jira.carnegietechnologies.com/browse/IOTP-2354
[IOTP-2392]: https://jira.carnegietechnologies.com/browse/IOTP-2392
[IOTP-2355]: https://jira.carnegietechnologies.com/browse/IOTP-2355
[IOTP-2397]: https://jira.carnegietechnologies.com/browse/IOTP-2397
[IOTP-2465]: https://jira.carnegietechnologies.com/browse/IOTP-2465
[IOTP-2475]: https://jira.carnegietechnologies.com/browse/IOTP-2475
[IOTP-2267]: https://jira.carnegietechnologies.com/browse/IOTP-2267
[IOTP-1320]: https://jira.carnegietechnologies.com/browse/IOTP-1320
[IOTP-2373]: https://jira.carnegietechnologies.com/browse/IOTP-2373
[IOTP-2296]: https://jira.carnegietechnologies.com/browse/IOTP-2296
[IOTP-2295]: https://jira.carnegietechnologies.com/browse/IOTP-2295